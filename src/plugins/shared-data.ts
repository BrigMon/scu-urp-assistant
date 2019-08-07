// 共享数据插件

function getCurrentSemesterNumber() {
  if (!window.__$SUA_SHARED_DATA__) {
    return ''
  }
  return window.__$SUA_SHARED_DATA__.academicInfo.currentSemester
}

function getCurrentSemesterText() {
  if (!window.__$SUA_SHARED_DATA__) {
    return ''
  }
  const r = window.__$SUA_SHARED_DATA__.academicInfo.currentSemester.match(
    /(\d+)-(\d+)-(\d)/
  )
  if (!r) {
    return ''
  }
  return `${r[1]}-${r[2]}学年 ${r[3] === '1' ? '秋' : '春'}季学期`
}

export { getCurrentSemesterNumber, getCurrentSemesterText }

export default {
  name: 'shared-data',
  pathname: '/**',
  async init() {
    window.__$SUA_SHARED_DATA__ = {
      core: {
        suaPath: ''
      },
      academicInfo: {
        courseNumber: 0,
        currentSemester: '',
        gpa: 0,
        currentSemesterCourseNumber: 0,
        failedCourseNumber: 0
      }
    }
    // 保证处在登陆后界面
    if (window.location.pathname !== '/login') {
      // 加载suaPath
      const regexp = window.location.hash.match(/suapath=(.+)$/)
      let suaPath = ''
      if (regexp) {
        suaPath = regexp[1]
      }
      window.__$SUA_SHARED_DATA__.core = { suaPath }
      // 加载本学期基本信息
      const [
        {
          zxjxjhh: currentSemester,
          gpa,
          courseNum: courseNumber,
          courseNum_bxqyxd: currentSemesterCourseNumber,
          coursePas: failedCourseNumber
        }
      ] = JSON.parse(await $.post('/main/academicInfo'))
      // 设置值
      window.__$SUA_SHARED_DATA__.academicInfo = {
        courseNumber,
        currentSemester,
        gpa,
        currentSemesterCourseNumber,
        failedCourseNumber
      }
    }
  }
}