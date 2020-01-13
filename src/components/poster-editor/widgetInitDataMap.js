const setDataRangeMap = {
  text: {
    box: {
      show: true,
      detail: {
        top: true,
        left: true,
        height: true,
        width: true,
        background: true,
        zIndex: true
      }
    },
    content: {
      show: true
    },
    innerStyle: {
      show: true,
      detail: {
        align: true,
        lineHeight: true,
        fontSize: true,
        color: true,
        letterSpacing: true,
        isOblique: true,
        isBold: true
      }
    }
  },
  img: {
    box: {
      show: true,
      detail: {
        top: true,
        left: true,
        height: true,
        width: true,
        background: false,
        zIndex: true
      }
    },
    content: {
      show: false
    },
    innerStyle: {
      show: false,
      detail: {
        align: true,
        lineHeight: true,
        fontSize: true,
        color: true,
        letterSpacing: true,
        isOblique: true,
        isBold: true
      }
    }
  }
}

const defaultDataMap = {
  text: {
    top: 0,
    left: 0,
    height: 40,
    width: 100,
    align: {
      x: 2,
      y: 2
    },
    // textAlign: 'center',
    lineHeight: 14,
    fontSize: 14,
    background: 'rgba(0, 0, 0, 0)',
    color: 'rgba(0, 0, 0, 1)',
    letterSpacing: 0,
    isOblique: false,
    isBold: false
  },
  img: {
    top: 0,
    left: 0,
    height: 40,
    width: 100,
    align: {
      x: 2,
      y: 2
    }
  }
}

export {
  setDataRangeMap,
  defaultDataMap
}
