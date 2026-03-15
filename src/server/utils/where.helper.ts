import {
  and,
  between,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  isNotNull,
  isNull,
  lt,
  lte,
  ne,
  notBetween,
  notInArray,
  or,
  type SQL
} from 'drizzle-orm';
import { type PgColumn } from 'drizzle-orm/pg-core';

/**
 * Drizzle 지원 연산자 타입 확장
 */
type Operator
  = | 'eq' | 'ne'
    | 'lt' | 'lte' | 'gt' | 'gte'
    | 'like' | 'ilike'
    | 'in' | 'notIn'
    | 'between' | 'notBetween'
    | 'isNull' | 'isNotNull'
    | 'dynamic'; // 접미사 기반 동적 연산자

/**
 * Drizzle용 동적 Where 절 빌더 (확장형)
 */
export function buildDrizzleWhere<T extends Record<string, any>>(
  query: T,
  mapping: Partial<Record<keyof T, Operator>>,
  tableColumns: Record<string, PgColumn>,
  logicalOperator: 'AND' | 'OR' = 'AND'
): SQL | undefined {
  const conditions: (SQL | undefined)[] = [];

  for (const [ key, operator, ] of Object.entries(mapping)) {
    const dtoKey = key as keyof T & string;
    const column = tableColumns[dtoKey];
    if (!column) continue;

    // dynamic 연산자 처리: {dtoKey}_{suffix} 패턴 탐색
    if (operator === 'dynamic') {
      const suffixes = [ 'eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike', 'in', 'notIn', 'isNull', 'isNotNull', ];

      for (const suffix of suffixes) {
        const queryKey = `${dtoKey}_${suffix}`;
        const value = query[queryKey];

        if (suffix === 'isNull' && value !== undefined) {
          conditions.push(isNull(column));
          continue;
        }
        if (suffix === 'isNotNull' && value !== undefined) {
          conditions.push(isNotNull(column));
          continue;
        }

        if (value === undefined || value === null || value === '') continue;

        switch (suffix) {
          case 'eq':
            conditions.push(eq(column, value));
            break;
          case 'ne':
            conditions.push(ne(column, value));
            break;
          case 'gt':
            conditions.push(gt(column, value));
            break;
          case 'gte':
            conditions.push(gte(column, value));
            break;
          case 'lt':
            conditions.push(lt(column, value));
            break;
          case 'lte':
            conditions.push(lte(column, value));
            break;
          case 'like':
          case 'ilike':
            conditions.push(ilike(column, `%${value}%`));
            break;
          case 'in':
            if (Array.isArray(value) && value.length > 0) conditions.push(inArray(column, value));
            break;
          case 'notIn':
            if (Array.isArray(value) && value.length > 0) conditions.push(notInArray(column, value));
            break;
        }
      }

      // 접미사 없는 기본 키도 eq로 처리 (선택 사항)
      const defaultValue = query[dtoKey];
      if (defaultValue !== undefined && defaultValue !== null && defaultValue !== '') {
        conditions.push(eq(column, defaultValue));
      }

      continue;
    }

    const value = query[dtoKey];

    // isNull, isNotNull은 value가 없어도 처리 가능
    if (operator === 'isNull') {
      conditions.push(isNull(column));
      continue;
    }
    if (operator === 'isNotNull') {
      conditions.push(isNotNull(column));
      continue;
    }

    // 그 외 연산자들은 value가 있어야 함
    if (value === undefined || value === null || value === '') continue;

    switch (operator) {
      case 'eq':
        conditions.push(eq(column, value));
        break;
      case 'ne':
        conditions.push(ne(column, value));
        break;
      case 'lt':
        conditions.push(lt(column, value));
        break;
      case 'lte':
        conditions.push(lte(column, value));
        break;
      case 'gt':
        conditions.push(gt(column, value));
        break;
      case 'gte':
        conditions.push(gte(column, value));
        break;
      case 'like':
      case 'ilike':
        conditions.push(ilike(column, `%${value}%`));
        break;
      case 'in':
        if (Array.isArray(value) && value.length > 0) {
          conditions.push(inArray(column, value));
        }
        break;
      case 'notIn':
        if (Array.isArray(value) && value.length > 0) {
          conditions.push(notInArray(column, value));
        }
        break;
      case 'between':
        if (Array.isArray(value) && value.length === 2) {
          conditions.push(between(column, value[0], value[1]));
        }
        break;
      case 'notBetween':
        if (Array.isArray(value) && value.length === 2) {
          conditions.push(notBetween(column, value[0], value[1]));
        }
        break;
    }
  }

  const filteredConditions = conditions.filter((c): c is SQL => !!c);

  if (filteredConditions.length === 0) return undefined;

  return logicalOperator === 'AND'
    ? and(...filteredConditions)
    : or(...filteredConditions);
}
