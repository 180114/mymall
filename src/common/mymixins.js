import debounce from "./utils"
export const imgListenerMinxin = {
    data(){
        return{
            imgListener: null
        }
    },
    mounted() {
        const refresh = debounce(this.$refs.scroll.refresh, 200)
        this.imgListener = ()=>{
        refresh()
      }
      this.$bus.$on('imgLoad', this.imgListener)
    },
}