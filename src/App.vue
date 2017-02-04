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
      <canvas id="quadratic"></canvas>
      <div id="container">
        <div class="tips-line">共5个红包，已领完</div>
        <ul class="border-1px border-1px-before">
          <li class="border-1px border-1px-after" v-for="i in 5">
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
      </div>
    </div>
    <div id="blank"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Transform from './alloytouch/transform.js'

  export default {
    name: 'app',
    components: {},
    data(){
      return {
        quadraticCurveCanvas: null,
        quadraticCurve: null,
        // 初始化设置
        options: {
          touch: "",//反馈触摸的dom
          vertical: true,//不必需，默认是true代表监听竖直方向touch
          target: "#wrapper", //运动的对象
          property: "translateY",  //被滚动的属性
          sensitivity: 1,//不必需,触摸区域的灵敏度，默认值为1，可以为负数
          factor: 0.1,//不必需,默认值是1代表touch区域的1px的对应target.y的1
          step: 40
        },
        // 动态设置属性
        max: 0,
        min: 0
      }
    },
    methods: {
      change(v){
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
        this.quadraticCurve.lineTo(
          this.quadraticCurve.canvas.width,
          this.quadraticCurve.canvas.height)
        this.quadraticCurve.lineTo(
          0,
          this.quadraticCurve.canvas.height)
        this.quadraticCurve.stroke()
        this.quadraticCurve.closePath()
        this.quadraticCurve.fill()
        this.quadraticCurve.restore()
      },
      moveHeader(val){
          if(val>-70){
            this.header.translateY=val/2
          }else{
            this.header.translateY=-35+70+val
          }
      }
    },
    mounted(){
      document.addEventListener("touchmove", function (evt) {
        evt.preventDefault();
      })
      this.header = document.getElementById("header")
      Transform(this.header)

      this.quadraticCurveCanvas = document.getElementById('quadratic')
      this.quadraticCurveCanvas.width = window.innerWidth
      this.quadraticCurveCanvas.height = window.innerHeight
      this.quadraticCurve = this.quadraticCurveCanvas.getContext("2d")
      this.quadraticCurve.lineWidth = 1
      this.quadraticCurve.strokeStyle = "#cf3a50"
      this.quadraticCurve.fillStyle = "#fff"

      let container=document.getElementById('container')
      container.style.top = this.quadraticCurveCanvas.height / 7 * 3 +60+ 'px'
      document.getElementById('header').style.top = this.quadraticCurveCanvas.height / 7 * 3 -35 -35-100 + 'px'

      this.drawQuadraticCurve(0)

      this.min=-(parseInt(window.getComputedStyle(container).top)
        +parseInt(window.getComputedStyle(container).height) -window.innerHeight+20)
      console.log(this.min)
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
    #header{
      position: fixed;
      top:0;
      width:100%;
      text-align: center;
      z-index: 2;
      #type{
        color:#fbd49d;
        line-height: 40px;
        font-size: larger;
      }
      #money{
        color:#fbd49d;
        font-size: 35px;
        line-height: 40px;
        margin-bottom:20px;
        &:before{
          content: "共";
          font-size: large;
        }
        &:after{
          content: "元";
          font-size: large;
        }
      }
      #pic{
        width:70px;
        height:70px;
        margin:0 auto;
        img{
          width:70px;
          height:70px;
          border-radius: 50%;
          display: block;
        }
      }
      #name{
        font-size: larger;
        line-height: 40px;
        &:after{
          content:"的红包";
        }
      }
    }
    #wrapper {
      position: relative;
      z-index: 1;
      #quadratic {
        position: absolute;
        top: 0;
      }
      #container {
        background: #fff;
        position: absolute;
        width: 100%;
        /*min-height:700px;*/
        padding-top:20px;
        .tips-line{
          color:#999;
          line-height:30px;
          padding-left:10px;
        }
        ul{
          list-style: none;
          li{
            display:flex;
            flex-direction:row;
            height:50px;
            margin-left:10px;
            padding:10px 10px 10px 0;
            .userhead{
              width:50px;
              height:50px;
              img{
                width:50px;
                height:50px;
                border-radius:50%;
                display:block;
              }
            }
            .wrapper-left{
              flex-grow:1;
              padding-left:10px;
              .name{
                font-size: larger;
              }
              .time{
                color:#999;
              }
            }
            .wrapper-right{
              .money{
                font-size: larger;
              }
              .lucky-king{
                font-size: small;
                color:#cf3a50;
                background:#fbd49d ;
                padding:0 3px;
                border-radius:5px;
              }
            }
          }
        }
      }
    }
    #blank{
      position: fixed;
      height:200px;
      width:100%;
      background: #fff;
      bottom:0;
      z-index:0;
    }
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
