import { TOKEN_TYPE, Token, lookupIdent } from "../token/token";

export class Lexer {
  input: string = '';
  position = 0;
  readPosition = 0;
  ch: string | 0 = '';
  constructor(input: string){
    this.input = input
  }
  readChar() {
    if (this.readPosition >= this.input.length)
    {
      this.ch = 0;
    } else
    {
      this.ch = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition++;
  }
  skipWhitespace() {
    while (this.ch === ' ' || this.ch === '\t' || this.ch === '\n' || this.ch === '\r')
    {
      this.readChar();
    }
  }
  readNumber() {
    const position = this.position;
    while (isDigit(this.ch))
    {
      this.readChar();
    }
    return this.input.slice(position, this.position)
  }
  peekChar() {
    if (this.readPosition >= this.input.length)
    {
      return 0;
    } else
    {
      return this.input[this.readPosition];
    }
  }
  nextToken(): Token {
    let token: Token = {type:TOKEN_TYPE.ILLEGAL, literal: ''}
    this.skipWhitespace();
    switch (this.ch)
    {
      case "=":
        if (this.peekChar() === '=') {
          const ch = this.ch
          this.readChar()
          const literal = ch + this.ch
          token = newToken(TOKEN_TYPE.EQ, literal)
        } else {
          token = newToken(TOKEN_TYPE.ASSIGN, this.ch)
        }
        break;
      case "+":
        token = newToken(TOKEN_TYPE.PLUS, this.ch)
        break;
      case "-":
        token = newToken(TOKEN_TYPE.MINUS, this.ch)
        break;
      case "*":
        token = newToken(TOKEN_TYPE.ASTERISK, this.ch)
        break;
      case "/":
        token = newToken(TOKEN_TYPE.SLASH, this.ch)
        break;
      case "<":
        token = newToken(TOKEN_TYPE.LT, this.ch)
        break;
      case ">":
        token = newToken(TOKEN_TYPE.GT, this.ch)
        break;
      case "!":
        if (this.peekChar() === '=') {
          const ch = this.ch
          this.readChar()
          const literal = ch + this.ch
          token = newToken(TOKEN_TYPE.NOT_EQ, literal)
        } else {
          token = newToken(TOKEN_TYPE.BANG, this.ch)
        }
        break;
      case ";":
        token = newToken(TOKEN_TYPE.SEMICOLON, this.ch)
        break;
      case ",":
        token = newToken(TOKEN_TYPE.COMMA, this.ch)
        break;
      case "(":
        token = newToken(TOKEN_TYPE.LPAREN, this.ch)
        break
      case ")":
        token = newToken(TOKEN_TYPE.RPAREN, this.ch)
        break;
      case "{":
        token = newToken(TOKEN_TYPE.LBRACE, this.ch)
        break;
      case "}":
        token = newToken(TOKEN_TYPE.RBRACE, this.ch)
        break
      case 0:
        token.type = TOKEN_TYPE.EOF
        token.literal = ''
        break;
      default:
        if (isLetter(this.ch)) {
          const literal = this.readIdentifier()
          token = {
            literal,
            type: lookupIdent(literal)
          }
          return token
        } else if(isDigit(this.ch)) {
          token = {
            type: TOKEN_TYPE.INT,
            literal: this.readNumber()
          }
        } else {
          token = newToken(TOKEN_TYPE.ILLEGAL, this.ch)
        }
        break;
    }
    return token;
  }
  readIdentifier(){
    const position = this.position
    while(isLetter(this.ch)) {
      this.readChar()
    }
    return this.input.slice(position,this.position)
  }
}

export function New(input: string): Lexer {
  const l = new Lexer(input);
  l.readChar();
  return l;
}


function isDigit(ch: string | 0) {
  return ch >= '0' && ch <= '9';
}
function isLetter(ch: string | 0) {
  return ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z' || ch === '_';
}

function newToken(tokenType: TOKEN_TYPE, ch: string | 0) {
  return {
    type: tokenType,
    literal: ch
  } as Token;
}