export default function debounce(func, delay){
    let timer = null
    return function (...args) {
      if(timer) clearTimeout(timer)
      timer = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    }
  }

// export default function getData(n){
//     n = new Date(n)
//     return n.toLocaleDateString().replace(/\//g, "-") + " " + n.toTimeString().substr(0, 8)
//   }
  