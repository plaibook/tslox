import Scanner, { Token, TokenType } from '../../compiler/scanner';
import Parser, { Expression } from '../../compiler/parser';
import ScopeAnalyst from '../../compiler/semantic/ScopeAnalyst';
import { VariableExpression } from '../../compiler/parser/expression';

describe('ScopeAnalyst', () => {
  test('scopeRecord', () => {
    const source = `
var foo = 4;

fun fn1(a, b) {
  for (var i = 0; i < foo; i = i + 1) {
    print i;    
  }

  while (foo > 0) {
    print foo;
  }

  if (a > 0) {
    return a;
  } else {
    return b;
  }
}

var bar = fn1(1,2);
`;
    const scanner = new Scanner(source);
    scanner.scan();
    const parser = new Parser(scanner.tokens);
    parser.parse();
    const scopeAnalyst = new ScopeAnalyst(parser.statements);
    scopeAnalyst.analysis();

    const list: { expression: Expression.BaseExpression; number: number }[] =
      [];
    scopeAnalyst.scopeRecord.forEach((value, key) => {
      list.push({
        expression: key,
        number: value,
      });
    });

    expect(list.length).toStrictEqual(7);

    expect(list[0].expression).toStrictEqual(
      new Expression.VariableExpression(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'i', line: 5 }),
      ),
    );
    expect(list[0].number).toStrictEqual(0);

    expect(list[1].expression).toStrictEqual(
      new Expression.VariableExpression(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'i', line: 5 }),
      ),
    );
    expect(list[1].number).toStrictEqual(0);

    expect(list[2].expression).toStrictEqual(
      new Expression.AssignmentExpression(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'i', line: 5 }),
        new Expression.BinaryExpression(
          new VariableExpression(
            new Token({ type: TokenType.IDENTIFIER, lexeme: 'i', line: 5 }),
          ),
          new Token({ type: TokenType.PLUS, lexeme: '+', line: 5 }),
          new Expression.LiteralExpression(1),
        ),
      ),
    );
    expect(list[2].number).toStrictEqual(0);

    expect(list[3].expression).toStrictEqual(
      new Expression.VariableExpression(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'i', line: 6 }),
      ),
    );
    expect(list[3].number).toStrictEqual(1);

    expect(list[4].expression).toStrictEqual(
      new Expression.VariableExpression(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'a', line: 13 }),
      ),
    );
    expect(list[4].number).toStrictEqual(0);

    expect(list[5].expression).toStrictEqual(
      new Expression.VariableExpression(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'a', line: 14 }),
      ),
    );
    expect(list[5].number).toStrictEqual(1);

    expect(list[6].expression).toStrictEqual(
      new Expression.VariableExpression(
        new Token({ type: TokenType.IDENTIFIER, lexeme: 'b', line: 16 }),
      ),
    );
    expect(list[6].number).toStrictEqual(1);
  });
});