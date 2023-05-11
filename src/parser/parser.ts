import { TOKEN_TYPE } from "../token/token";

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
