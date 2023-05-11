import { Expression, ExpressionStatement, Identifier, InfixExpression, IntegerLiteral, LetStatement, PrefixExpression, Program, ReturnStatement, Statement } from "../ast/ast";
import { Lexer } from "../lexer/lexer";
import { TOKEN_TYPE, Token } from "../token/token";

export const _ = 0
export const LOWEST = 1
export const EQUALS = 2
export const LESSGREATER = 3
export const SUM = 4
export const PRODUCT = 5
export const PREFIX = 6
export const CALL = 7

export const precedences = new Map([
  [TOKEN_TYPE.EQ, EQUALS],
  [TOKEN_TYPE.NOT_EQ, EQUALS],
  [TOKEN_TYPE.LT, LESSGREATER],
  [TOKEN_TYPE.GT, LESSGREATER],
  [TOKEN_TYPE.PLUS, SUM],
  [TOKEN_TYPE.MINUS, SUM],
  [TOKEN_TYPE.SLASH, PRODUCT],
  [TOKEN_TYPE.ASTERISK, PRODUCT],
])

export type prefixParseFn = () => Expression
export type infixParseFn = (left: Expression) => Expression


class Parser{
  l!: Lexer
  curToken!: Token
  peekToken!: Token
  errors: string[] = []
  prefixParseFns: Map<TOKEN_TYPE, prefixParseFn> = new Map
  infixParseFns: Map<TOKEN_TYPE, infixParseFn> = new Map
  constructor(l:Lexer){
    this.l = l
  }
  registerPrefix(tokenType: TOKEN_TYPE, fn: prefixParseFn){
    this.prefixParseFns.set(tokenType, fn)
  }
  registerInfix(tokenType: TOKEN_TYPE, fn: infixParseFn){
    this.infixParseFns.set(tokenType, fn)
  }
  nextToken(){
    this.curToken = this.peekToken
    this.peekToken = this.l.nextToken()
  }
  parseProgram(){
    const program = new Program()
    while(!this.curTokenIs(TOKEN_TYPE.EOF)) {
      const stmt = this.parseStatement()
      if (stmt != null) {
        program.statements.push(stmt)
      }
      this.nextToken()
    }
    return program
  }
  parseStatement():Statement{
    switch (this.curToken.type){
      case TOKEN_TYPE.LET:
        return this.parseLetStatement()
      case TOKEN_TYPE.RETURN:
        return this.parseReturnStatement()
      default:
        return this.parseExpressionStatement()
    }
  }
  parseLetStatement(){
    const stmt = new LetStatement()
    stmt.token = this.curToken
    if (this.expectPeek(TOKEN_TYPE.IDENT)) {
      return null
    }
    stmt.name = new Identifier(this.curToken, this.curToken.literal)
    if (!this.expectPeek(TOKEN_TYPE.ASSIGN)) {
      return null
    }
    // TODO 跳过对求值表达式的处理 直到遇到分号
    while(!this.curTokenIs(TOKEN_TYPE.SEMICOLON)) {
      this.nextToken()
    }
    return stmt
  }
  parseReturnStatement(){
    const stmt = new ReturnStatement()
    stmt.token = this.curToken
    this.nextToken()
    while(!this.curTokenIs(TOKEN_TYPE.SEMICOLON)) {
      this.nextToken()
    }
    return stmt
  }
  parseExpressionStatement(){
    const stmt = new ExpressionStatement()
    stmt.token = this.curToken
    stmt.expression = this.parseExpression(LOWEST)
    if (this.peekTokenIs(TOKEN_TYPE.SEMICOLON)) {
      this.nextToken() // 有分号就跳过
    }
    return stmt
  }
  curTokenIs(tokenType: TOKEN_TYPE) {
    return this.curToken.type === tokenType
  }
  peekTokenIs(tokenType: TOKEN_TYPE){
    return this.peekToken.type === tokenType
  }
  expectPeek(tokenType: TOKEN_TYPE) {
    if (this.peekTokenIs(tokenType)) {
      this.nextToken()
      return true
    } 
    this.peekError(tokenType)
    return false
  }
  peekError(tokenType: TOKEN_TYPE){
    const msg = `expected next token to be ${tokenType}, got ${this.peekToken.type} instead.`
    this.errors.push(msg)
  }
  parseIndentifier = ():Expression => {
    return new Identifier(this.curToken, this.curToken.literal)
  }
  parseIntegerLiteral = ():Expression => {
    const lit = new IntegerLiteral(this.curToken)
    const value = parseInt(this.curToken.literal)
    if (Object.is(value, NaN)) {
      const msg = `could not parse ${this.curToken.literal} as integer`
      this.errors.push(msg)
      return null
    }
    lit.value = value
    return lit
  }
  noPrefixParseFnError(tokenType: TOKEN_TYPE){
    const msg = `no prefix parse function for ${tokenType} found.`
    this.errors.push(msg)
  }
  parsePrefixExpression = () => {
    const expression = new PrefixExpression()
    expression.token = this.curToken
    expression.operator = this.curToken.literal
    this.nextToken()
    expression.right = this.parseExpression(PREFIX)!
    return expression
  }
  parseExpression(precedence: number = LOWEST) {
    const prefix = this.prefixParseFns.get(this.curToken.type)
    if (!prefix) {
      this.noPrefixParseFnError(this.curToken.type)
      return null
    }
    let leftExp = prefix()
    while(this.peekTokenIs(TOKEN_TYPE.SEMICOLON) && precedence < this.peekPrecedence()) {
      const infix = this.infixParseFns.get(this.peekToken.type)
      if (!infix) {
        return leftExp
      }
      this.nextToken()
      leftExp = infix(leftExp)
    }
    return leftExp
  }
  peekPrecedence(){
    if (precedences.has(this.peekToken.type)) {
      return precedences.get(this.peekToken.type)!
    }
    return LOWEST
  }
  curPrecedence(){
    if (precedences.has(this.curToken.type)) {
      return precedences.get(this.curToken.type)!
    }
    return LOWEST
  }
  parseInfixExpression = (left: Expression) => {
    const expression = new InfixExpression()
    expression.token = this.curToken
    expression.operator = this.curToken.literal
    expression.left = left
    const precedence = this.curPrecedence()
    this.nextToken()
    expression.right = this.parseExpression(precedence)!
    return expression
  }
}

export function NewParser(l: Lexer):Parser{
  const p = new Parser(l)
  p.registerPrefix(TOKEN_TYPE.IDENT, p.parseIndentifier)
  p.registerPrefix(TOKEN_TYPE.INT, p.parseIntegerLiteral)
  p.registerPrefix(TOKEN_TYPE.BANG, p.parsePrefixExpression)
  p.registerPrefix(TOKEN_TYPE.MINUS, p.parsePrefixExpression)

  p.registerInfix(TOKEN_TYPE.PLUS, p.parseInfixExpression)
  p.registerInfix(TOKEN_TYPE.MINUS, p.parseInfixExpression)
  p.registerInfix(TOKEN_TYPE.SLASH, p.parseInfixExpression)
  p.registerInfix(TOKEN_TYPE.ASTERISK, p.parseInfixExpression)
  p.registerInfix(TOKEN_TYPE.EQ, p.parseInfixExpression)
  p.registerInfix(TOKEN_TYPE.NOT_EQ, p.parseInfixExpression)
  p.registerInfix(TOKEN_TYPE.LT, p.parseInfixExpression)
  p.registerInfix(TOKEN_TYPE.GT, p.parseInfixExpression)
  p.nextToken()
  p.nextToken()
  return p
}