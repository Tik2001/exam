<template>
  <div class="bod">
    <div
      style="
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        margin-top: 20px;
      "
    >
      <edit-button
        v-for="button in buttons"
        :key="button.id"
        :title="button.title"
        :icon="button.icon"
        @on-click-customize="button.func"
      ></edit-button>

      <a-popover placement="bottom" class="radius">
        <template #content>
          <p>Zoom In</p>
        </template>
        <a-button @click="zoomIn" class="radius">
          <v-icon name="bi-zoom-in"
        /></a-button>
      </a-popover>
      <a-popover placement="bottom">
        <template #content>
          <p>Zoom Out</p>
        </template>
        <a-button @click="zoomOut" class="radius">
          <v-icon name="bi-zoom-out"
        /></a-button>
      </a-popover>
      <div
        style="
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          margin-left: 350px;
        "
      >
        <input type="file" @change="loadImage" accept="image/*" />
        <a-popover placement="rightBottom">
          <template #content>
            <p>Save</p>
          </template>
          <a-button @click="saveImage" class="save-button">
            <v-icon name="gi-save-arrow"
          /></a-button>
        </a-popover>
      </div>
    </div>
    <div class="image-editor">
      <div class="canvas-container">
        <canvas ref="canvas"></canvas>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-around;
          "
        ></div>
      </div>
    </div>
    <!-- <div class="effects-container"> -->

    <!-- </div> -->
  </div>
</template>

<script>
import { message } from "ant-design-vue";
import EditButton from "./components/EditButton.vue";

export default {
  el: "#mouse",
  components: {
    EditButton,
  },
  data() {
    return {
      buttons: [
        { id: 1, title: "Sepia", icon: "md-darkmode", func: this.applySepia },
        {
          id: 2,
          title: "Brightness",
          icon: "md-brightnesslow-twotone",
          func: this.applyBrightness,
        },
        {
          id: 3,
          title: "Contrast",
          icon: "io-contrast-outline",
          func: this.applyContrast,
        },
        {
          id: 4,
          title: "Blur",
          icon: "ri-blur-off-line",
          func: this.applyBlur,
        },
        {
          id: 5,
          title: "Invert",
          icon: "md-invertcolors",
          func: this.applyInvert,
        },
        {
          id: 6,
          title: "Grayscale",
          icon: "gi-blackball",
          func: this.applyGrayscale,
        },
        { id: 7, title: "Pen", icon: "fa-pen", func: this.togglePenMode },
        {
          id: 8,
          title: "Hue Rotate",
          icon: "md-rotateright-sharp",
          func: this.applyHueRotate,
        },
        {
          id: 9,
          title: "Reset",
          icon: "md-layersclear-sharp",
          func: this.resetImage,
        },
      ],
      image: null,
      ctx: null,
      originalImage: null,
      scale: 1,
      penMode: false,
      message: "Hover Me!",
      icons: [
        "md-darkmode",
        "md-brightnesslow-twotone",
        "io-contrast-outline",
        "ri-blur-off-line",
        "md-invertcolors",
        "gi-blackball",
        "fa-pen",
        "md-rotateright-sharp",
        "md-layersclear-sharp",
        "bi-zoom-in",
      ],
    };
  },
  mounted() {
    this.ctx = this.$refs.canvas.getContext("2d");
    this.$refs.canvas.addEventListener("mousedown", this.startDrawing);
    this.$refs.canvas.addEventListener("mousemove", this.draw);
    this.$refs.canvas.addEventListener("mouseup", this.stopDrawing);
    this.$refs.canvas.addEventListener("mouseout", this.stopDrawing);
  },
  beforeUnmount() {
    this.$refs.canvas.removeEventListener("mousedown", this.startDrawing);
    this.$refs.canvas.removeEventListener("mousemove", this.draw);
    this.$refs.canvas.removeEventListener("mouseup", this.stopDrawing);
    this.$refs.canvas.removeEventListener("mouseout", this.stopDrawing);
  },
  methods: {
    mouseover: function () {
      this.message = "Good!";
    },
    mouseleave: function () {
      this.message = "Hover Me!";
    },
    loadImage(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.image = new Image();
        this.image.onload = () => {
          this.$refs.canvas.width = this.image.width;
          this.$refs.canvas.height = this.image.height;
          this.ctx.drawImage(this.image, 0, 0);
          this.originalImage = this.ctx.getImageData(
            0,
            0,
            this.$refs.canvas.width,
            this.$refs.canvas.height
          );
        };
        this.image.src = e.target.result;
      };

      reader.readAsDataURL(file);
    },
    applyGrayscale() {
      const imageData = this.ctx.getImageData(
        0,
        0,
        this.$refs.canvas.width,
        this.$refs.canvas.height
      );
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }

      this.ctx.putImageData(imageData, 0, 0);
    },
    applyInvert() {
      const imageData = this.ctx.getImageData(
        0,
        0,
        this.$refs.canvas.width,
        this.$refs.canvas.height
      );
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]; // Red
        data[i + 1] = 255 - data[i + 1]; // Green
        data[i + 2] = 255 - data[i + 2]; // Blue
      }

      this.ctx.putImageData(imageData, 0, 0);
    },
    applySepia() {
      const imageData = this.ctx.getImageData(
        0,
        0,
        this.$refs.canvas.width,
        this.$refs.canvas.height
      );
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        data[i] = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b);
        data[i + 1] = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b);
        data[i + 2] = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b);
      }

      this.ctx.putImageData(imageData, 0, 0);
    },
    applyBrightness() {
      const imageData = this.ctx.getImageData(
        0,
        0,
        this.$refs.canvas.width,
        this.$refs.canvas.height
      );
      const data = imageData.data;
      const adjustment = 50;

      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] + adjustment); // Red
        data[i + 1] = Math.min(255, data[i + 1] + adjustment); // Green
        data[i + 2] = Math.min(255, data[i + 2] + adjustment); // Blue
      }

      this.ctx.putImageData(imageData, 0, 0);
    },
    applyContrast() {
      const imageData = this.ctx.getImageData(
        0,
        0,
        this.$refs.canvas.width,
        this.$refs.canvas.height
      );
      const data = imageData.data;
      const contrast = 1.5;

      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        data[i] = Math.max(0, Math.min(255, contrast * (red - 128) + 128)); // Red
        data[i + 1] = Math.max(
          0,
          Math.min(255, contrast * (green - 128) + 128)
        ); // Green
        data[i + 2] = Math.max(0, Math.min(255, contrast * (blue - 128) + 128)); // Blue
      }

      this.ctx.putImageData(imageData, 0, 0);
    },
    applyBlur() {
      const imageData = this.ctx.getImageData(
        0,
        0,
        this.$refs.canvas.width,
        this.$refs.canvas.height
      );
      const data = imageData.data;
      const blurRadius = 2;

      const kernel = [];
      const kernelSize = blurRadius * 2 + 1;

      for (let i = 0; i < kernelSize; i++) {
        kernel[i] = [];
        for (let j = 0; j < kernelSize; j++) {
          kernel[i][j] = 1 / (kernelSize * kernelSize);
        }
      }

      const newData = new Uint8ClampedArray(data.length);

      for (let y = blurRadius; y < this.$refs.canvas.height - blurRadius; y++) {
        for (
          let x = blurRadius;
          x < this.$refs.canvas.width - blurRadius;
          x++
        ) {
          let r = 0;
          let g = 0;
          let b = 0;

          for (let j = 0; j < kernelSize; j++) {
            for (let i = 0; i < kernelSize; i++) {
              const k = kernel[j][i];
              const pixelIndex =
                ((y + j - blurRadius) * this.$refs.canvas.width +
                  (x + i - blurRadius)) *
                4;

              r += data[pixelIndex] * k;
              g += data[pixelIndex + 1] * k;
              b += data[pixelIndex + 2] * k;
            }
          }

          const pixelIndex = (y * this.$refs.canvas.width + x) * 4;

          newData[pixelIndex] = r;
          newData[pixelIndex + 1] = g;
          newData[pixelIndex + 2] = b;
          newData[pixelIndex + 3] = data[pixelIndex + 3];
        }
      }

      for (let i = 0; i < data.length; i++) {
        data[i] = newData[i];
      }

      this.ctx.putImageData(imageData, 0, 0);
    },
    applyHueRotate() {
      const imageData = this.ctx.getImageData(
        0,
        0,
        this.$refs.canvas.width,
        this.$refs.canvas.height
      );
      const data = imageData.data;
      const angle = 90; // Rotate by 90 degrees

      for (let i = 0; i < data.length; i += 4) {
        const [r, g, b] = [data[i], data[i + 1], data[i + 2]];

        const hsv = rgbToHsv(r, g, b);

        const rotatedHue = (hsv.h + angle) % 360;
        const [newR, newG, newB] = hsvToRgb(rotatedHue, hsv.s, hsv.v);

        data[i] = newR;
        data[i + 1] = newG;
        data[i + 2] = newB;
      }

      this.ctx.putImageData(imageData, 0, 0);
    },
    resetImage() {
      this.ctx.clearRect(
        0,
        0,
        this.$refs.canvas.width,
        this.$refs.canvas.height
      );
      this.ctx.putImageData(this.originalImage, 0, 0);
    },
    zoomIn() {
      this.scale += 0.1;
      this.updateCanvasTransform();
    },
    zoomOut() {
      this.scale -= 0.1;
      this.updateCanvasTransform();
    },
    updateCanvasTransform() {
      this.$refs.canvas.style.transform = `scale(${this.scale})`;
    },
    saveImage() {
      const link = document.createElement("a");
      link.href = this.$refs.canvas.toDataURL();
      link.download = "image.png";
      link.click();
    },
    togglePenMode() {
      this.penMode = !this.penMode;
    },
    startDrawing(event) {
      if (!this.penMode) return;

      this.ctx.beginPath();
      this.ctx.moveTo(event.offsetX, event.offsetY);
    },
    draw(event) {
      if (!this.penMode || event.buttons !== 1) return;
      console.log(event.offsetX + "ofX");
      console.log(this.image.width + "width");
      console.log(event.offsetY + "ofY");
      console.log(this.image.width + "heigth");
      this.ctx.lineTo(
        event.offsetX  , 
          event.offsetY);
      this.ctx.stroke();
    },
    stopDrawing() {
      if (!this.penMode) return;

      this.ctx.closePath();
    },
  },
};

function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h, s, v;

  if (max === min) {
    h = 0;
  } else if (max === r) {
    h = 60 * ((g - b) / (max - min)) + 0;
  } else if (max === g) {
    h = 60 * ((b - r) / (max - min)) + 120;
  } else if (max === b) {
    h = 60 * ((r - g) / (max - min)) + 240;
  }

  if (max === 0) {
    s = 0;
  } else {
    s = 1 - min / max;
  }

  v = max;

  return { h, s, v };
}

function hsvToRgb(h, s, v) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r, g, b;

  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else if (h >= 300 && h < 360) {
    [r, g, b] = [c, 0, x];
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}
</script>

<style scoped>
.bod {
  --u: 1.5vmax; /* change hexagon size */
  --c1: #60b2f3;
  --c2: #489de2;
  --c3: #2c8cd8;
  --c4: #1d81d0;
  --gp: 50% / calc(var(--u) * 10) calc(var(--u) * 12);
  --glt: repeating-conic-gradient(
      from 210deg at 16.66% 25%,
      var(--c2) 0% 33.3%,
      rgba(219, 12, 12, 0) 0% 100%
    )
    var(--gp);
  --glb: repeating-conic-gradient(
      from 210deg at 16.66% 75%,
      var(--c4) 0% 33.3%,
      #fff0 0% 100%
    )
    var(--gp);
  height: 100vh;
  background: repeating-linear-gradient(
        to bottom,
        var(--c1) 0% 1.5%,
        transparent 1.5% 23.5%,
        var(--c2) 23.5% 26.5%,
        transparent 26.5% 48.5%,
        var(--c3) 48.5% 51.5%,
        transparent 51.5% 73.5%,
        var(--c4) 73.5% 76.5%,
        transparent 76.5% 98.5%,
        var(--c1) 98.5% 100%
      )
      var(--gp),
    var(--glt), var(--glb), var(--glt), var(--glb), var(--glt), var(--glb),
    var(--glt), var(--glb),
    repeating-conic-gradient(
        from 150deg at 50% 75%,
        var(--c1) 0% 33.3%,
        #fff0 0% 100%
      )
      var(--gp),
    repeating-conic-gradient(
        from 90deg at 66.66% 50%,
        var(--c4) 0% 33.3%,
        #fff0 0% 100%
      )
      var(--gp),
    repeating-conic-gradient(
        from -90deg at 50% 25%,
        var(--c1) 0% 33.3%,
        var(--c2) 0% 66.4%,
        var(--c3) 0% 100%
      )
      var(--gp);

  /* transform: rotate(60deg); */
  overflow: hidden;
}

.bod:before {
  content: "";
  background: linear-gradient(
    -45deg,
    #002542 0%,
    transparent 50%,
    #d2ebff 100%
  );
  position: absolute;
  width: 100vw;
  height: 13vh;
  transform: rotate(-60deg);
}

.image-editor {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
.butt {
  border-radius: 20px;
}
.butt:hover {
  background-color: red;
}
.canvas-container {
  margin-top: 20px;
  overflow: auto;
  width: 100%;
  position: relative;
  z-index: 2;
  display: flex;
}
canvas {
  margin-top: 20px;
  transform-origin: top left;
  transition: traform 0.3s ease-in-out;
  border: solid 1px rgb(255, 11, 11);
  width: 100%;
  height: 600px;
  cursor: crosshair;
}
.effects-container {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  justify-content: space-around;
  width: 400px;
}

/* .zoom-buttons {
  /* margin-top: 10px;} */

button {
  margin-right: 10px;
  margin-left: 10px;
}

.pen-button {
  cursor: pointer;
  border-radius: 50px;
}
.radius {
  border-radius: 50px;
}
</style>
