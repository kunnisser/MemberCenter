/*
* 开发与发布环境配置
* */

let productPath = 'http://www.me2u.com.cn';
let productImagePath = 'http://www.me2u.com.cn';
let prostatus = process.env.NODE_ENV;
let basePath = prostatus === 'development' ? '' : productPath;
let imagePath = prostatus === 'development' ? '' : productImagePath;

export {
  basePath,
  imagePath,
  prostatus
};
