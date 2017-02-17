<template>
  <div id="app"
       v-alloytouch="{options,methods:{change},max,min}">

    <div id="header">
      <div id="type">突然想发个红包</div>
      <div id="money">1.00</div>
      <div id="pic">
        <img src="./assets/head.jpg" alt="logo">
      </div>
      <div id="name">章鱼烧</div>
    </div>
    <div id="wrapper">
      <canvas id="quadratic" @touchend="open"></canvas>
      <div id="container">
        <transition name="slide">
          <div class="tips-line" v-if="isOpen">共8个红包，已领完</div>
        </transition>
        <transition name="slide" @after-enter="afterOpen">
          <ul id="detail-list" class="border-1px border-1px-before" v-if="isOpen">
            <li class="border-1px border-1px-after" v-for="i in 8">
              <div class="userhead">
                <img src="./assets/head.jpg" alt="">
              </div>
              <div class="wrapper-left">
                <div class="name">章鱼烧</div>
                <div class="time">15:50:36</div>
              </div>
              <div class="wrapper-right">
                <div class="money">0.39</div>
                <div class="lucky-king">运气王</div>
              </div>
            </li>
          </ul>
        </transition>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Transform from './alloytouch/transform.js'
  import TWEEN from 'tween.js'
  import {hex2rgb,rgb2hex} from './utils.js'
  export default {
    name: 'app',
    components: {},
    data(){
      return {
          isOpening:true,
        isOpen: false,
        quadraticCurveCanvas: null,
        quadraticCurve: null,
        // 初始化设置
        options: {
          touch: "",//反馈触摸的dom
          vertical: true,//不必需，默认是true代表监听竖直方向touch
          target: "#wrapper", //运动的对象
          property: "translateY",  //被滚动的属性
          sensitivity: 1,//不必需,触摸区域的灵敏度，默认值为1，可以为负数
          factor: 1,//不必需,默认值是1代表touch区域的1px的对应target.y的1
          step: 40
        },
        // 动态设置属性
        max: 0,
        min: 0
      }
    },
    methods: {
      change(v){
        if (this.isOpening)return
        if (v > -70) {
          this.drawQuadraticCurve(v)
        }
        this.moveHeader(v)
      },
      drawQuadraticCurve(val){
        this.quadraticCurve.clearRect(0, 0, this.quadraticCurve.canvas.width, this.quadraticCurve.canvas.height)
        this.quadraticCurve.save()
        this.quadraticCurve.beginPath()
        this.quadraticCurve.moveTo(0, this.quadraticCurve.canvas.height / 7 * 3)
        this.quadraticCurve.quadraticCurveTo(
          this.quadraticCurve.canvas.width / 2,
          this.quadraticCurve.canvas.height / 7 * 3 - val - 70,
          this.quadraticCurve.canvas.width,
          this.quadraticCurve.canvas.height / 7 * 3)
        this.quadraticCurve.lineTo(this.quadraticCurve.canvas.width, 0)
        this.quadraticCurve.lineTo(0, 0)
        this.quadraticCurve.stroke()
        this.quadraticCurve.closePath()
        this.quadraticCurve.fill()
        this.quadraticCurve.restore()
      },
      moveHeader(val){
        if (val > -70) {
          this.header.translateY = val / 2
        } else {
          this.header.translateY = -35 + 70 + val
        }
      },
      animationPacket(){
        let vm = this

        function animate(time) {
          requestAnimationFrame(animate)
          TWEEN.update(time)
        }

        new TWEEN.Tween({
          ...hex2rgb('#c3304a'),
          p: 100
        })
          .to({...hex2rgb('#fff'), p: 0}, 300)
          .onUpdate(function () {
            vm.container.style.background = rgb2hex(this.r,this.g,this.b)
            vm.drawQuadraticCurve(this.p)
            vm.moveHeader(this.p)
            vm.wrapper.translateY=this.p
          }).start()

        animate()
      },
      open(){
        if (this.isOpen)return
        this.isOpen = true
        this.isOpening=true
        this.animationPacket()
      },
      afterOpen(){
        this.isOpening=false
        let detailList = document.getElementById('detail-list')
        this.container.style.height = parseInt(window.getComputedStyle(detailList).height) + 30 + 'px'

        this.min = -(parseInt(window.getComputedStyle(this.container).paddingTop)
        + parseInt(window.getComputedStyle(this.container).height) - window.innerHeight)
      }
    },
    mounted(){
      this.app = document.getElementById("app")
      this.header = document.getElementById("header")
      this.wrapper= document.getElementById("wrapper")
      Transform(this.app, true)
      Transform(this.header)

      this.quadraticCurveCanvas = document.getElementById('quadratic')
      this.quadraticCurveCanvas.width = window.innerWidth
      this.quadraticCurveCanvas.height = window.innerHeight
      this.quadraticCurve = this.quadraticCurveCanvas.getContext("2d")
      this.quadraticCurve.lineWidth = 1
      this.quadraticCurve.strokeStyle = "#cf3a50"
      this.quadraticCurve.fillStyle = "#cf3a50"
//      this.quadraticCurve.fillStyle = "#c3304a"
//      this.quadraticCurve.fillStyle = "#fff"

      this.drawQuadraticCurve(100)
      this.moveHeader(100)
      this.wrapper.translateY=100
      document.getElementById('header').style.top = this.quadraticCurveCanvas.height / 7 * 3 - 35 - 35 - 100 + 'px'

      this.container = document.getElementById('container')
      this.container.style.paddingTop = this.quadraticCurveCanvas.height / 7 * 3 + 60 + 20 + 'px'
      this.container.style.minHeight = parseInt(window.innerHeight) - parseInt(this.container.style.paddingTop) + 'px'

//      requestAnimationFrame(this.animationPacket)
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  * {
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  #app {
    font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", STHeiti, "Microsoft Yahei", Tahoma, Simsun, sans-serif;
    height: 100%;
    background: #cf3a50;
    /*background: #fff;*/
    overflow: hidden;
    animation: .5s packet-open;
    #header {
      position: fixed;
      top: 0;
      width: 100%;
      text-align: center;
      z-index: 3;
      #type {
        color: #fbd49d;
        line-height: 40px;
        font-size: larger;
      }
      #money {
        color: #fbd49d;
        font-size: 35px;
        line-height: 40px;
        margin-bottom: 20px;
        &:before {
          content: "共";
          font-size: large;
        }
        &:after {
          content: "元";
          font-size: large;
        }
      }
      #pic {
        width: 70px;
        height: 70px;
        margin: 0 auto;
        img {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: block;
        }
      }
      #name {
        font-size: larger;
        line-height: 40px;
        &:after {
          content: "的红包";
        }
      }
    }
    #wrapper {
      position: relative;
      z-index: 1;
      #quadratic {
        position: absolute;
        top: 0;
        z-index: 2;
      }
      #container {
        background: #c3304a;
        /*opacity:0;*/
        position: absolute;
        width: 100%;
        height: 100%;
        padding-top: 20px;
        .tips-line {
          color: #999;
          line-height: 30px;
          padding-left: 10px;
        }
        ul {
          list-style: none;
          li {
            display: flex;
            flex-direction: row;
            height: 50px;
            margin-left: 10px;
            padding: 10px 10px 10px 0;
            .userhead {
              width: 50px;
              height: 50px;
              img {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: block;
              }
            }
            .wrapper-left {
              flex-grow: 1;
              padding-left: 10px;
              .name {
                font-size: larger;
              }
              .time {
                color: #999;
              }
            }
            .wrapper-right {
              .money {
                font-size: larger;
              }
              .lucky-king {
                font-size: small;
                color: #cf3a50;
                background: #fbd49d;
                padding: 0 3px;
                border-radius: 5px;
              }
            }
          }
        }
      }
    }
    #blank {
      position: fixed;
      height: 200px;
      width: 100%;
      background: #fff;
      bottom: 0;
      z-index: 0;
    }
  }

  @keyframes packet-open {
    0% {
      transform: scale(0.3);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes container-background {
    0% {
      background: #c3304a;
    }
    100% {
      background: #fff;
    }
  }

  .slide-enter-active {
    transition: all .3s ease;
  }

  .slide-leave-active {
    transition: all .3s ease-out;
  }

  .slide-enter, .slide-leave-active {
    transform: translateY(100px);
    opacity: 0;
  }

  /*border-1px 部分*/
  .border-1px {
    position: relative;
  }

  .border-1px-after:after {
    border-top: 1px solid #d0d0d0;
    content: ' ';
    display: block;
    width: 100%;
    position: absolute;
    left: 0;
  }

  .border-1px-before:before {
    border-top: 1px solid #d0d0d0;
    content: ' ';
    display: block;
    width: 100%;
    position: absolute;
    left: 0;
  }

  .border-1px:before {
    top: 0;
  }

  .border-1px:after {
    bottom: 0;
  }

  @media (-webkit-min-device-pixel-ratio: 1.5), (min-device-pixel-ratio: 1.5) {
    .border-1px:after, .border-1px:before {
      -webkit-transform: scaleY(.7);
      -webkit-transform-origin: 0 0;
      transform: scaleY(.7);
    }

    .border-1px:after {
      -webkit-transform-origin: left bottom;
    }
  }

  @media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2) {
    .border-1px:after, .border-1px:before {
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
    }
  }
</style>
