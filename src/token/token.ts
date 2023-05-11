enum TOKEN_TYPE{
  ILLEGAL = "ILLEGAL" ,// 未知的类型 非法类型等
	EOF     = "EOF"     ,// end of file
	// 标识符 + 字面量
	IDENT = "IDENT" ,// 变量标识符
	INT   = "INT"   ,// 数字
	// 运算符
	ASSIGN   = "=",
	PLUS     = "+",
	MINUS    = "-",
	BANG     = "!",
	ASTERISK = "*",
	SLASH    = "/",
	LT       = "<",
	GT       = ">",
	// 等于 不等于运算符 为什么在这里指出来？ 因为这是两个字符构成的 也就是双字符的运算符
	EQ     = "==",
	NOT_EQ = "!=",
	// TODO 支持更多双字符运算符 >= <= && || 如果支持二进制 还可以支持 >> << 那么应该抽取成方法了 比如 makeTwoCharToken
	// 分割符
	COMMA     = ",",
	SEMICOLON = ";",
	// 左右小括号 大括号
	LPAREN = "(",
	RPAREN = ")",
	LBRACE = "{",
	RBRACE = "}",
	// 关键字
	LET      = "LET",
	FUNCTION = "FUNCTION",
	TRUE     = "TRUE",
	FALSE    = "FALSE",
	IF       = "IF",
	ELSE     = "ELSE",
	RETURN   = "RETURN",
}


interface Token {
  Type :TOKEN_TYPE
  Literal :string
}

const keywords = new Map<string, TOKEN_TYPE>([
  ["fn",     TOKEN_TYPE.FUNCTION],
	["let",    TOKEN_TYPE.LET],
	["true",  TOKEN_TYPE.TRUE],
	["false",  TOKEN_TYPE.FALSE],
	["if",   TOKEN_TYPE.IF],
	["else",   TOKEN_TYPE.ELSE],
	["return", TOKEN_TYPE.RETURN],
])

function lookupIdent(ident: string): TOKEN_TYPE{
  if (keywords.has(ident)) return keywords.get(ident)!
  return TOKEN_TYPE.IDENT
}

export {
  lookupIdent,
  TOKEN_TYPE,
  keywords
}