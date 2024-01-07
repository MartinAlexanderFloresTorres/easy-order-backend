import slug from 'slug';
import { v4 } from 'uuid';

/**
 * @param {*} value
 * @returns  {string} slug
 * @description Generate a slug from a string
 * @example generateSlug('Hello World') // hello-world-52354
 * @example generateSlug('Hello / wordl 123') // hello-world-123-52354
 */

const generateSlug = (value, includesRamdom = true) => {
  const options = { lower: true, replacement: '-', remove: /[*+~.()'"!:@]/g, locale: 'es', trim: true, strict: true };
  if (!includesRamdom) return slug(value, options);
  const ramdom = v4().split('-')[0];
  return slug(`${value} ${ramdom}`, options);
};

export default generateSlug;
