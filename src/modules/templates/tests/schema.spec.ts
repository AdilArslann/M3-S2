import { omit } from "lodash/fp";
import {parse, parseInsertable, parsePartial} from '../schema';
import { templateFactoryFull } from "./utils";


it('parses a valid record', ()=>{
  const record = templateFactoryFull();
  expect(parse(record)).toEqual(record);
})

it('throws an error due to missing or empty content (concrete)', ()=>{
  const templateWithoutContent= {
    id:2,
  };
  const templateWithEmptyContent= {
    id:3,
    content: ""
  };

  expect (()=> parse(templateWithoutContent)).toThrow(/content/i);
  expect (()=> parse(templateWithEmptyContent)).toThrow(/content/i);
})

it('throws an error due to missing or empty content (generic)', ()=>{
  const templateWithoutContent = omit(['content'], templateFactoryFull());
  const templateWithEmptyContent = templateFactoryFull({
    content: "",
  });

  expect (()=> parse(templateWithoutContent)).toThrow(/content/i);
  expect (()=> parse(templateWithEmptyContent)).toThrow(/content/i);
})

it('parseInsertable. Omits id', ()=>{
  const parsed = parseInsertable(templateFactoryFull());
  expect(parsed).not.toHaveProperty('id');
})

it('parsePartial. Omits id', () => {
  const parsed = parsePartial(templateFactoryFull());
  expect(parsed).not.toHaveProperty('id');
})