<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const currentStep = ref(0)
const selectedNumber = ref<number | null>(null)
const isAnimating = ref(false)

const steps = [
  { title: '开始', desc: '请想一个1-10之间的数字' },
  { title: '计算', desc: '将这个数字乘以2' },
  { title: '计算', desc: '再加上5' },
  { title: '计算', desc: '再乘以50' },
  { title: '计算', desc: '如果今年生日已经过了，加上1775；如果还没过，加上1774' },
  { title: '计算', desc: '再减去你的出生年份' },
  { title: '结果', desc: '得到一个三位数，第一位是你想的数字，后两位是你的年龄' }
]

const handleNext = () => {
  if (currentStep.value < steps.length - 1) {
    isAnimating.value = true
    setTimeout(() => {
      currentStep.value++
      isAnimating.value = false
    }, 300)
  }
}

const handlePrev = () => {
  if (currentStep.value > 0) {
    isAnimating.value = true
    setTimeout(() => {
      currentStep.value--
      isAnimating.value = false
    }, 300)
  }
}

const handleReset = () => {
  currentStep.value = 0
  selectedNumber.value = null
}
</script>

<template>
  <div class="mind-reading-page">
    <div class="header">
      <h1>神秘读心术</h1>
      <p class="subtitle">Mind Reading Magic</p>
    </div>

    <div class="content">
      <div class="step-container" :class="{ 'animate': isAnimating }">
        <div class="step-header">
          <span class="step-number">{{ currentStep + 1 }}</span>
          <span class="step-title">{{ steps[currentStep].title }}</span>
        </div>
        
        <div class="step-content">
          <p class="step-desc">{{ steps[currentStep].desc }}</p>
          
          <div v-if="currentStep === 0" class="number-selector">
            <p>选择你想的数字：</p>
            <div class="number-grid">
              <button 
                v-for="n in 10" 
                :key="n"
                class="number-btn"
                :class="{ 'selected': selectedNumber === n }"
                @click="selectedNumber = n"
              >
                {{ n }}
              </button>
            </div>
          </div>

          <div v-if="currentStep === steps.length - 1" class="result-section">
            <div class="result-box">
              <p class="result-text">🎉 神奇的读心术！</p>
              <p class="result-desc">第一位数字：<strong>{{ selectedNumber || '?' }}</strong></p>
              <p class="result-desc">你的年龄：<strong>???</strong></p>
            </div>
          </div>
        </div>
      </div>

      <div class="navigation">
        <button 
          v-if="currentStep > 0" 
          class="nav-btn prev"
          @click="handlePrev"
        >
          ← 上一步
        </button>
        
        <button 
          v-if="currentStep < steps.length - 1" 
          class="nav-btn next"
          :disabled="currentStep === 0 && !selectedNumber"
          @click="handleNext"
        >
          下一步 →
        </button>
        
        <button 
          v-if="currentStep === steps.length - 1" 
          class="nav-btn reset"
          @click="handleReset"
        >
          🔄 再玩一次
        </button>
      </div>
    </div>

    <div class="footer">
      <p>© 2026 Mind Reading Magic</p>
    </div>
  </div>
</template>

<style lang="less" scoped>
.mind-reading-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    color: white;
    font-size: 2.5rem;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .subtitle {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.2rem;
  }
}

.content {
  width: 100%;
  max-width: 600px;
}

.step-container {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  
  &.animate {
    opacity: 0;
    transform: translateY(20px);
  }
}

.step-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  
  .step-number {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  .step-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
  }
}

.step-content {
  .step-desc {
    font-size: 1.2rem;
    color: #555;
    line-height: 1.8;
    margin-bottom: 20px;
    text-align: center;
  }
}

.number-selector {
  text-align: center;
  
  p {
    color: #666;
    margin-bottom: 20px;
    font-size: 1.1rem;
  }
  
  .number-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 15px;
    
    .number-btn {
      width: 60px;
      height: 60px;
      border: 2px solid #ddd;
      border-radius: 15px;
      font-size: 1.5rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      background: white;
      
      &:hover {
        border-color: #667eea;
        transform: scale(1.1);
      }
      
      &.selected {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-color: transparent;
      }
    }
  }
}

.result-section {
  text-align: center;
  
  .result-box {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    border-radius: 15px;
    padding: 30px;
    
    .result-text {
      color: white;
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 20px;
    }
    
    .result-desc {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.2rem;
      margin-bottom: 10px;
      
      strong {
        color: white;
        font-size: 1.5rem;
      }
    }
  }
}

.navigation {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  
  .nav-btn {
    padding: 12px 30px;
    border: none;
    border-radius: 30px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &.prev {
      background: rgba(255, 255, 255, 0.9);
      color: #667eea;
      
      &:hover {
        background: white;
        transform: translateX(-5px);
      }
    }
    
    &.next {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      
      &:hover:not(:disabled) {
        transform: translateX(5px);
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    
    &.reset {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      color: white;
      
      &:hover {
        transform: scale(1.05);
        box-shadow: 0 10px 30px rgba(17, 153, 142, 0.4);
      }
    }
  }
}

.footer {
  margin-top: 50px;
  
  p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }
}

@media (max-width: 600px) {
  .mind-reading-page {
    padding: 15px;
  }
  
  .header h1 {
    font-size: 1.8rem;
  }
  
  .step-container {
    padding: 20px;
  }
  
  .number-grid {
    gap: 10px !important;
    
    .number-btn {
      width: 50px;
      height: 50px;
      font-size: 1.2rem;
    }
  }
  
  .nav-btn {
    padding: 10px 20px !important;
    font-size: 1rem !important;
  }
}
</style>
