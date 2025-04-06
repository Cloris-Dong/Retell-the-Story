// 创建真实的鼠标点击音效
const fs = require('fs');
const { exec } = require('child_process');

// 创建 AudioContext
const AudioContext = require('web-audio-api').AudioContext;
const audioContext = new AudioContext();
const sampleRate = 44100;
const duration = 0.15; // 150ms
const samples = duration * sampleRate;

// 创建音频缓冲区
const buffer = audioContext.createBuffer(1, samples, sampleRate);
const channel = buffer.getChannelData(0);

// 生成鼠标点击声音
for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;

    // 主频率（较低的基础音）
    const baseFreq = 200;
    // 高频成分（点击的清脆声）
    const highFreq = 2000;

    // 基础音（较长的衰减）
    const baseSound = Math.sin(2 * Math.PI * baseFreq * t) * Math.exp(-15 * t);
    // 高频音（快速衰减）
    const highSound = Math.sin(2 * Math.PI * highFreq * t) * Math.exp(-50 * t);

    // 组合声音
    channel[i] = (baseSound * 0.3 + highSound * 0.7);

    // 添加轻微的噪声
    channel[i] += (Math.random() * 2 - 1) * 0.05 * Math.exp(-30 * t);
}

// 将音频数据保存为WAV文件
const wav = require('node-wav');
const wavData = wav.encode([channel], { sampleRate: sampleRate, float: true, bitDepth: 16 });
fs.writeFileSync('sounds/click.wav', wavData);

console.log('Successfully created mouse click sound (click.wav)'); 