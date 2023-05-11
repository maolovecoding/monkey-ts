import { TOKEN_TYPE, Token } from "../token/token";


interface Node{
  tokenLiteral(): string
  toString(): string 
}

interface Statement extends Node{
  statementNode(): void
}

interface Expression extends Node{
  expressionNode(): void
}

class Program {
  statements: Statement[] = []
  toString(){
    let str = ''
    for (const s of this.statements){
      str += s.toString()
    }
    return str
  }
}

class LetStatement implements Statement{
  token!: Token
  name!: Identifier
  value!: Expression
  statementNode(){
  }
  tokenLiteral(): string {
    return this.token.literal
  }
  toString(): string {
    let str = ''
    str += this.tokenLiteral()+" "
    str += this.name.toString()
    str+=" = "
    if (this.value != null) {
      str+=this.value.toString()
    }
    str+=";"
    return str
  }
}

class Identifier implements Expression{
  constructor(public token: Token, public value: string){}
  expressionNode(){
  }
  tokenLiteral(): string {
    return this.token.literal
  }
  toString(): string {
    return this.value
  }
}

class ReturnStatement implements Statement{
  token!: Token
  returnValue!: Expression
  statementNode(){
  }
  tokenLiteral(): string {
    return this.token.literal
  }
  toString(): string {
    let str = ''
    str+=this.tokenLiteral()+" "
    if (this.returnValue!=null) {
      str+=this.returnValue.toString()
    }
    str+=';'
    return str
  }
}

class ExpressionStatement implements Statement{
  token!: Token
  expression!: Expression
  statementNode(){
  }
  tokenLiteral(): string {
    return this.token.literal
  }
  toString(): string {
    if (this.expression!=null) {
      return this.expression.toString()
    }
    return ''
  }
}

class IntegerLiteral implements Expression{
  value!: number
  constructor(public token: Token){}
  expressionNode(){
  }
  tokenLiteral(): string {
    return this.token.literal
  }
  toString(): string {
    return this.token.literal
  }
}

class PrefixExpression implements Expression{
  token!: Token
  operator!: string
  right!: Expression
  expressionNode(){
  }
  tokenLiteral(): string {
    return this.token.literal
  }
  toString(): string {
    let str = ''
    str+='('
    str+=this.operator
    str+=this.right.toString()
    str+=')'
    return str 
  }
}


class InfixExpression implements Expression{
  token!: Token
  left!: Expression
  operator!: string
  right!: Expression
  expressionNode(){
  }
  tokenLiteral(): string {
    return this.token.literal
  }
  toString(): string {
    let str = ''
    str+='('
    str+=this.left.toString()
    str+=" "+this.operator+" "
    str+=this.right.toString()
    str+=')'
    return str 
  }
}

export type{
  Expression,
  Statement
}
export {
  Program,
  Identifier,
  IntegerLiteral,
  PrefixExpression,
  InfixExpression,
  LetStatement,
  ReturnStatement,
  ExpressionStatement
}