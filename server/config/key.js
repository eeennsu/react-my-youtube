if(process.env.NODE_ENV === 'production'){                                  // 배포 단계이면?
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');                                      // 개발 단계이면?
}