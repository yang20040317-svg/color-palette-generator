import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Upload, RefreshCw, Image as ImageIcon, Palette, Type, Zap, X, ImagePlus, Maximize, Minimize, Check } from 'lucide-react';

// Enhanced presets with more realistic data matching the screenshot
const PRESETS = [
  // 氛围感 (Atmosphere)
  { id: 'p1', name: '氛围感', number: '8', title: '种氛围感', mood: '氛围感', colors: ['#F4F3E3', '#A6B48B', '#2D5016'], image: '', textColor: '#000000' },
  // 治愈感 (Healing)
  { id: 'p2', name: '治愈感', number: '8', title: '种治愈感', mood: '治愈感', colors: ['#E0F7FA', '#80DEEA', '#0097A7'], image: '', textColor: '#000000' },
  // 高级感 (Premium)
  { id: 'p3', name: '高级感', number: '8', title: '种高级感', mood: '高级感', colors: ['#EFEBE9', '#A1887F', '#4E342E'], image: '', textColor: '#000000' },
  // 机械感 (Mechanical)
  { id: 'p4', name: '机械感', number: '4', title: '种机械感', mood: '机械感', colors: ['#263238', '#546E7A', '#B0BEC5'], image: '', textColor: '#FFFFFF' },
  // 清新感 (Fresh)
  { id: 'p5', name: '清新感', number: '7', title: '种清新感', mood: '清新感', colors: ['#F1F8E9', '#DCEDC8', '#8BC34A'], image: '', textColor: '#000000' },
  // 柔和感 (Soft)
  { id: 'p6', name: '柔和感', number: '7', title: '种柔和感', mood: '柔和感', colors: ['#FFF3E0', '#FFCCBC', '#FF9800'], image: '', textColor: '#000000' },
  // 治愈感 (Healing 2)
  { id: 'p7', name: '治愈感2', number: '8', title: '种治愈感', mood: '治愈感', colors: ['#E8F5E8', '#C8E6C9', '#4CAF50'], image: '', textColor: '#000000' },
  // 柔和 (Soft)
  { id: 'p8', name: '柔和', number: '3', title: '种宠物之家温馨感', mood: '柔和', colors: ['#F5F5F5', '#E0E0E0', '#BDBDBD'], image: '', textColor: '#000000' },
  // 横版示例 (Landscape Example)
  { id: 'p9', name: '横版示例', number: '3', title: '种横版展示效果', mood: '柔和', colors: ['#F5F5F5', '#E0E0E0', '#BDBDBD'], image: 'https://picsum.photos/600/400', textColor: '#000000' },
];

/**
 * Helper to determine text color based on background luminance.
 */
const getContrastColor = (hex) => {
  const color = hex.startsWith('#') ? hex.slice(1) : hex;
  const fullColor = color.length === 3
    ? color.split('').map(c => c + c).join('')
    : color;

  const r = parseInt(fullColor.substr(0, 2), 16);
  const g = parseInt(fullColor.substr(2, 2), 16);
  const b = parseInt(fullColor.substr(4, 2), 16);
  
  // Perceived luminance (YIQ) calculation
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  return (yiq >= 150) ? '#000000' : '#ffffff';
};

// Modern ColorCard Component with distinct designs for grid and full screen views
const ColorCard = ({ data, onClick, onDoubleClick, isSelected, isFullScreen = false, styleOverride = {} }) => {
  const { number, title, mood, colors, image } = data;
  
  // 图片尺寸检测，区分横图和竖图
  const [isLandscape, setIsLandscape] = useState(false);
  
  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        setIsLandscape(img.width > img.height);
      };
      img.src = image;
    } else {
      setIsLandscape(false);
    }
  }, [image]);
  
  // 可复用的横版颜色块组件
  const RenderHorizontalColorBlocks = ({ size = 'medium' }) => {
    const styles = {
      small: {
        container: {
          display: 'flex',
          gap: '6px',
          marginBottom: '12px',
          width: '100%'
        },
        block: {
          flex: 1,
          height: '60px',
          borderRadius: '8px',
          padding: '8px 10px 8px 10px',
          maxWidth: 'calc(33.333% - 4px)'
        },
        text: {
          fontSize: '12px',
          whiteSpace: 'nowrap',
          overflow: 'visible',
          fontWeight: '700'
        }
      },
      medium: {
        container: {
          display: 'flex',
          gap: '8px',
          marginBottom: '12px',
          width: '100%'
        },
        block: {
          flex: 1,
          height: '80px',
          borderRadius: '10px',
          padding: '10px 14px 10px 14px',
          maxWidth: 'calc(33.333% - 5.333px)'
        },
        text: {
          fontSize: '14px',
          whiteSpace: 'nowrap',
          overflow: 'visible',
          fontWeight: '700'
        }
      }
    };
    
    const config = styles[size];
    
    return (
      <div style={config.container}>
        {colors.slice(0, 3).map((color, index) => (
          <div key={index} style={{
            ...config.block,
            backgroundColor: color,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-start'
          }}>
            <div style={{
              ...config.text,
              fontWeight: '700',
              color: getContrastColor(color),
              fontFamily: 'var(--font-sans)',
              letterSpacing: '-0.5px'
            }}>
              {color}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Grid View Design - 跟单独展一样的设计，减少留白
  if (!isFullScreen) {
    return (
      <div
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        style={{
          width: 280,
          height: 360,
          backgroundColor: '#000000',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          border: isSelected ? '2px solid #6366f1' : '2px solid transparent',
          position: 'relative',
          color: '#ffffff',
          fontFamily: 'var(--font-bold)',
          ...styleOverride
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-4px)';
          e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
        }}>
        {/* Top Header Section - 跟单独展一样的设计，减少留白 */}
        <div style={{
          padding: '12px 20px',
          position: 'relative'
        }}>
          {/* Left: Number and Title - 跟单独展一样的设计 */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', position: 'relative', height: '60px' }}>
            {/* Large Number - 调整大小和位置，与文字在同一水平面 */}
            <span style={{
              fontSize: '56px',
              fontWeight: '900',
              color: colors[0] || '#D12128',
              lineHeight: 1,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-2.5px',
              marginBottom: '-4px' /* 调整垂直位置，与文字在同一水平面 */
            }}>
              {number}
            </span>
            
            {/* Title Section - 跟单独展一样的设计 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{
                fontSize: '12px',
                color: colors[0] || '#D12128',
                marginBottom: '2px',
                fontWeight: '700',
                fontFamily: 'var(--font-bold)',
                letterSpacing: '-0.5px'
              }}>
                配色灵感
              </div>
              <div style={{
                fontSize: '20px',
                fontWeight: '900',
                color: colors[0] || '#D12128',
                lineHeight: 1.2,
                fontFamily: 'var(--font-display)',
                letterSpacing: '-1px'
              }}>
                {title}
              </div>
            </div>
          </div>
          
          {/* Right: Color Reference - 与左侧数字平行对齐 */}
          <div style={{
            position: 'absolute',
            bottom: '16px', /* 调整垂直位置，与左侧数字平行 */
            right: '20px',
            display: 'grid',
            gridTemplateColumns: 'auto auto',
            gridTemplateRows: 'auto auto',
            gap: '1px', /* 减小间距，更紧凑 */
            alignItems: 'flex-end', /* 确保与数字在同一水平面 */
            justifyContent: 'flex-end' /* 右对齐 */
          }}>
            <div style={{ 
              fontSize: '18px',
              fontWeight: '900',
              color: colors[1] || '#A6B48B',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-1px',
              textAlign: 'center',
              lineHeight: 1 /* 确保行高一致，更紧凑 */
            }}>
              配
            </div>
            <div style={{ 
              fontSize: '18px',
              fontWeight: '900',
              color: colors[1] || '#A6B48B',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-1px',
              textAlign: 'center',
              lineHeight: 1 /* 确保行高一致，更紧凑 */
            }}>
              色
            </div>
            <div style={{ 
              fontSize: '18px',
              fontWeight: '900',
              color: colors[1] || '#A6B48B',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-1px',
              textAlign: 'center',
              lineHeight: 1 /* 确保行高一致，更紧凑 */
            }}>
              参
            </div>
            <div style={{ 
              fontSize: '18px',
              fontWeight: '900',
              color: colors[1] || '#A6B48B',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-1px',
              textAlign: 'center',
              lineHeight: 1 /* 确保行高一致，更紧凑 */
            }}>
              考
            </div>
          </div>
        </div>

        {/* Main Color Section - 跟单独展一样的设计，减少留白 */}
        <div style={{
          padding: '0 20px 12px 20px'
        }}>
          {/* Primary Color Block - 跟单独展一样的设计，减少留白，横版卡片不显示 */}
          {(!isLandscape || !image) && (
            <div style={{
              backgroundColor: colors[0] || '#F1F8E9',
              borderRadius: '10px',
              padding: '10px 16px',
              marginBottom: '8px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px'
              }}>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '900',
                  color: getContrastColor(colors[0] || '#F1F8E9'),
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.5px'
                }}>
                  {mood}
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '900',
                  color: getContrastColor(colors[0] || '#F1F8E9'),
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.5px'
                }}>
                  color
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: getContrastColor(colors[0] || '#F1F8E9'),
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '-0.5px'
                }}>
                  {colors[0] || '#F1F8E9'}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: getContrastColor(colors[0] || '#F1F8E9'),
                  fontWeight: '700',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '-0.5px'
                }}>
                  附海报参考
                </div>
              </div>
            </div>
          )}

          {/* 横图布局 */}
          {isLandscape && image && (
            <>
              {/* Image Preview */}
              <div style={{
                width: '100%',
                height: '120px',
                borderRadius: '10px',
                backgroundColor: '#1e1e1e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                marginBottom: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#2a2a2a';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#1e1e1e';
              }}
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById('image-upload')?.click();
              }}>
                <img
                  src={image}
                  alt={title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-size: 12px; font-family: var(--font-sans);">图片加载失败</div>';
                  }}
                />
                {/* Image Overlay Text */}
                <div>
                  {/* Left: Mood */}
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '12px'
                  }}>
                    <div style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      color: '#E0E0E0',
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: '-0.3px',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.7)'
                    }}>
                      {mood}
                    </div>
                  </div>
                  
                  {/* Right: Illustration Reference */}
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '12px'
                  }}>
                    <div style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      color: '#E0E0E0',
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: '-0.3px',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.7)'
                    }}>
                      符插画参考
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Color Scheme */}
              <RenderHorizontalColorBlocks size="small" />
            </>
          )}

          {/* 竖图布局 */}
          {(!isLandscape || !image) && (
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              {/* Left: Secondary Colors - Stacked */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Secondary Color 1 - 减少留白 */}
                <div style={{
                  backgroundColor: colors[1] || '#DCEDC8',
                  borderRadius: '10px',
                  padding: '10px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'flex-end'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: getContrastColor(colors[1] || '#DCEDC8'),
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: '-0.5px'
                  }}>
                    {colors[1] || '#DCEDC8'}
                  </div>
                </div>

                {/* Secondary Color 2 - 减少留白 */}
                <div style={{
                  backgroundColor: colors[2] || '#8BC34A',
                  borderRadius: '10px',
                  padding: '10px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'flex-end'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: getContrastColor(colors[2] || '#8BC34A'),
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: '-0.5px'
                  }}>
                    {colors[2] || '#8BC34A'}
                  </div>
                </div>
              </div>

              {/* Right: Image Preview - 跟单独展一样的设计 */}
              <div style={{
                width: '80px',
                borderRadius: '10px',
                backgroundColor: '#1e1e1e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!image) {
                  e.target.style.backgroundColor = '#2a2a2a';
                }
              }}
              onMouseLeave={(e) => {
                if (!image) {
                  e.target.style.backgroundColor = '#1e1e1e';
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById('image-upload')?.click();
              }}>
                {image ? (
                  <img
                    src={image}
                    alt={title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-size: 12px; font-family: var(--font-sans);">图片加载失败</div>';
                    }}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px', color: '#666' }}>
                    <ImageIcon size={24} style={{ color: '#666' }} />
                    <div style={{ fontSize: '10px', textAlign: 'center' }}>点击上传</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer - 跟单独展一样的设计，减少留白 */}
        <div style={{
          padding: '0 20px 16px 20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end', /* 调整为底部对齐，确保DESIGN和SHARE在同一水平线 */
            paddingTop: '8px',
            borderTop: '1px solid #333333'
          }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'flex-end', /* 调整为底部对齐 */
              gap: '6px'
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: '900',
                color: colors[2] || '#FAE3AC',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-2px',
                lineHeight: 1
              }}>
                01
              </div>
              <div style={{ 
              fontSize: '12px', 
              color: colors[2] || '#FAE3AC', 
              fontWeight: '700',
              fontFamily: 'var(--font-geo)',
              letterSpacing: '-0.01em',
              textTransform: 'uppercase'
            }}>
              DESIGN
            </div>
            </div>
            
            <div style={{
              textAlign: 'right',
              fontSize: '12px',
              color: colors[2] || '#FAE3AC',
              fontFamily: 'var(--font-handwriting)',
              fontWeight: '400',
              letterSpacing: '0.05em',
              lineHeight: 1.2
            }}>
              <div>DAILY PORTFOLIO</div>
              <div>— SHARE</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full Screen Design - 参考单独展示的排版，减少留白
  // 使用组件顶部已经声明的isLandscape状态

  // 横图排版
  if (isLandscape && image) {
    return (
      <div
        style={{
          width: 420,
          height: 480,
          backgroundColor: '#000000',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)',
          cursor: 'default',
          position: 'relative',
          color: '#ffffff',
          ...styleOverride
        }}>
        {/* Top Header Section */}
        <div style={{
          padding: '16px 24px',
          position: 'relative',
          backgroundColor: '#000000'
        }}>
          {/* Left: Number and Title */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '80px' }}>
            {/* Large Number */}
            <span style={{
              fontSize: '72px',
              fontWeight: '900',
              color: colors[0] || '#D12128',
              lineHeight: 1,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-3.5px',
              marginBottom: '-6px'
            }}>
              {number}
            </span>
            
            {/* Title Section */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{
                fontSize: '14px',
                color: colors[0] || '#D12128',
                marginBottom: '2px',
                fontWeight: '700',
                fontFamily: 'var(--font-bold)',
                letterSpacing: '-0.5px'
              }}>
                配色灵感
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '900',
                color: colors[0] || '#D12128',
                lineHeight: 1.2,
                fontFamily: 'var(--font-display)',
                letterSpacing: '-1px'
              }}>
                {title}
              </div>
            </div>
          </div>
          
          {/* Right: Color Reference */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '24px',
            display: 'grid',
            gridTemplateColumns: 'auto auto',
            gridTemplateRows: 'auto auto',
            gap: '2px',
            alignItems: 'flex-end',
            justifyContent: 'flex-end'
          }}>
            <div style={{ 
              fontSize: '24px',
              fontWeight: '900',
              color: colors[1] || '#A6B48B',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-1px',
              textAlign: 'center',
              lineHeight: 1
            }}>配</div>
            <div style={{ 
              fontSize: '24px',
              fontWeight: '900',
              color: colors[1] || '#A6B48B',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-1px',
              textAlign: 'center',
              lineHeight: 1
            }}>色</div>
            <div style={{ 
              fontSize: '24px',
              fontWeight: '900',
              color: colors[1] || '#A6B48B',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-1px',
              textAlign: 'center',
              lineHeight: 1
            }}>参</div>
            <div style={{ 
              fontSize: '24px',
              fontWeight: '900',
              color: colors[1] || '#A6B48B',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-1px',
              textAlign: 'center',
              lineHeight: 1
            }}>考</div>
          </div>
        </div>

        {/* Landscape Image Section */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '172px',
          overflow: 'hidden',
          padding: '8px 24px'
        }}>
          <img
            src={image}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '8px'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-size: 14px; font-family: var(--font-sans);">图片加载失败</div>';
            }}
          />
          
          {/* Image Overlay Text */}
          <div>
            {/* Left: Mood */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '36px'
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#E0E0E0',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '-0.3px',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.7)'
              }}>
                {mood}
              </div>
            </div>
            
            {/* Right: Illustration Reference */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              right: '36px'
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#E0E0E0',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '-0.3px',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.7)'
              }}>
                符插画参考
              </div>
            </div>
          </div>
        </div>

        {/* Color Scheme Section */}
        <div style={{
          padding: '16px 24px 0 24px',
          backgroundColor: '#000000',
          marginTop: '8px'
        }}>
          {/* Color Blocks */}
          <RenderHorizontalColorBlocks size="medium" />
        </div>

        {/* Footer */}
        <div style={{
          padding: '8px 24px 16px 24px',
          backgroundColor: '#000000',
          marginTop: '16px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: '8px'
          }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'flex-end',
              gap: '8px'
            }}>
              <div style={{
                fontSize: '48px',
                fontWeight: '900',
                color: colors[2] || '#FAE3AC',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-3px',
                lineHeight: 1
              }}>
                {number}
              </div>
              <div style={{ 
                fontSize: '16px', 
                color: colors[2] || '#FAE3AC', 
                fontWeight: '700',
                fontFamily: 'var(--font-geo)',
                letterSpacing: '-0.01em',
                textTransform: 'uppercase'
              }}>
                DESIGN
              </div>
            </div>
            
            <div style={{
              textAlign: 'right',
              fontSize: '14px',
              color: colors[2] || '#FAE3AC',
              fontFamily: 'var(--font-handwriting)',
              fontWeight: '400',
              letterSpacing: '0.05em',
              lineHeight: 1.2
            }}>
              <div style={{ marginBottom: '2px' }}>DAILY PORTFOLIO</div>
              <div>— SHARE</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 竖图排版（默认）
  return (
    <div
      style={{
        width: 420,
        height: 480,
        backgroundColor: '#000000',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)',
        cursor: 'default',
        position: 'relative',
        color: '#ffffff',
        ...styleOverride
      }}>
      {/* Top Header Section - 参考单独展示的排版，减少留白 */}
      <div style={{
        padding: '16px 24px',
        position: 'relative',
        backgroundColor: '#000000'
      }}>
        {/* Left: Number and Title - 参考单独展示的排版 */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '80px' }}>
          {/* Large Number - 调整大小和位置，与文字在同一水平面 */}
          <span style={{
            fontSize: '72px',
            fontWeight: '900',
            color: colors[0] || '#D12128',
            lineHeight: 1,
            fontFamily: 'var(--font-display)',
            letterSpacing: '-3.5px',
            marginBottom: '-6px' /* 调整垂直位置，与文字在同一水平面 */
          }}>
            {number}
          </span>
          
          {/* Title Section - 参考单独展示的排版 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{
              fontSize: '14px',
              color: colors[0] || '#D12128',
              marginBottom: '2px',
              fontWeight: '700',
              fontFamily: 'var(--font-bold)',
              letterSpacing: '-0.5px'
            }}>
              配色灵感
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: '900',
              color: colors[0] || '#D12128',
              lineHeight: 1.2,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-1px'
            }}>
              {title}
            </div>
          </div>
        </div>
        
        {/* Right: Color Reference - 更紧凑，与配色灵感平齐 */}
        <div style={{
          position: 'absolute',
          bottom: '20px', /* 调整垂直位置，与配色灵感平齐 */
          right: '24px',
          display: 'grid',
          gridTemplateColumns: 'auto auto',
          gridTemplateRows: 'auto auto',
          gap: '2px', /* 减小间距，更紧凑 */
          alignItems: 'flex-end', /* 确保与配色灵感在同一水平面 */
          justifyContent: 'flex-end' /* 右对齐 */
        }}>
          <div style={{ 
            fontSize: '24px',
            fontWeight: '900',
            color: colors[1] || '#A6B48B',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-1px',
            textAlign: 'center',
            lineHeight: 1 /* 确保行高一致，更紧凑 */
          }}>配</div>
          <div style={{ 
            fontSize: '24px',
            fontWeight: '900',
            color: colors[1] || '#A6B48B',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-1px',
            textAlign: 'center',
            lineHeight: 1 /* 确保行高一致，更紧凑 */
          }}>色</div>
          <div style={{ 
            fontSize: '24px',
            fontWeight: '900',
            color: colors[1] || '#A6B48B',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-1px',
            textAlign: 'center',
            lineHeight: 1 /* 确保行高一致，更紧凑 */
          }}>参</div>
          <div style={{ 
            fontSize: '24px',
            fontWeight: '900',
            color: colors[1] || '#A6B48B',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-1px',
            textAlign: 'center',
            lineHeight: 1 /* 确保行高一致，更紧凑 */
          }}>考</div>
        </div>
      </div>

      {/* Main Color Section - 参考单独展示的排版，减少留白 */}
      <div style={{
        padding: '0 24px 12px 24px',
        backgroundColor: '#000000'
      }}>
        {/* Primary Color Block - 参考单独展示的排版，减少留白 */}
        <div style={{
          backgroundColor: colors[0] || '#D12128',
          borderRadius: '12px',
          padding: '14px 20px',
          marginBottom: '10px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '900',
              color: '#000000',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-1px'
            }}>
              {mood}
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: '900',
              color: '#000000',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-1px'
            }}>
              color
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              fontSize: '16px',
              color: '#000000',
              fontWeight: '700',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '-0.5px'
            }}>
              {colors[0] || '#D12128'}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#000000',
              fontWeight: '700',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '-0.5px'
            }}>
              附海报参考
            </div>
          </div>
        </div>

        {/* Secondary Colors and Image - 参考单独展示的排版 */}
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          {/* Left: Secondary Colors - Stacked */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Secondary Color 1 - 减少留白 */}
            <div style={{
              backgroundColor: colors[1] || '#01344F',
              borderRadius: '12px',
              padding: '16px',
              height: '80px',
              display: 'flex',
              alignItems: 'flex-end'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '700',
                color: getContrastColor(colors[1] || '#01344F'),
                fontFamily: 'var(--font-sans)',
                letterSpacing: '-0.5px'
              }}>
                {colors[1] || '#01344F'}
              </div>
            </div>

            {/* Secondary Color 2 - 减少留白 */}
            <div style={{
              backgroundColor: colors[2] || '#FAE3AC',
              borderRadius: '12px',
              padding: '16px',
              height: '80px',
              display: 'flex',
              alignItems: 'flex-end'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '700',
                color: getContrastColor(colors[2] || '#FAE3AC'),
                fontFamily: 'var(--font-sans)',
                letterSpacing: '-0.5px'
              }}>
                {colors[2] || '#FAE3AC'}
              </div>
            </div>
          </div>

          {/* Right: Image Preview - 参考单独展示的排版 */}
          <div style={{
            width: '140px',
            borderRadius: '12px',
            backgroundColor: '#1e1e1e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexDirection: 'column',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!image) {
              e.target.style.backgroundColor = '#2a2a2a';
            }
          }}
          onMouseLeave={(e) => {
            if (!image) {
              e.target.style.backgroundColor = '#1e1e1e';
            }
          }}
          onClick={() => {
            if (!isFullScreen) {
              document.getElementById('image-upload')?.click();
            }
          }}>
            {image ? (
              <img
                src={image}
                alt={title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-size: 14px; font-family: var(--font-sans);">图片加载失败</div>';
                }}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '12px', color: '#666' }}>
                <ImageIcon size={40} style={{ color: '#666' }} />
                <div style={{ fontSize: '12px', textAlign: 'center' }}>点击上传</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer - 参考单独展示的排版，减少留白 */}
      <div style={{
        padding: '16px 24px',
        backgroundColor: '#000000'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end', /* 调整为底部对齐，确保DESIGN和SHARE在同一水平线 */
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'flex-end', /* 调整为底部对齐 */
            gap: '8px'
          }}>
            <div style={{
              fontSize: '48px',
              fontWeight: '900',
              color: colors[2] || '#FAE3AC',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-3px',
              lineHeight: 1
            }}>
              01
            </div>
            <div style={{ 
              fontSize: '16px', 
              color: colors[2] || '#FAE3AC', 
              fontWeight: '700',
              fontFamily: 'var(--font-geo)',
              letterSpacing: '-0.01em',
              textTransform: 'uppercase'
            }}>
              DESIGN
            </div>
          </div>
          
          <div style={{
            textAlign: 'right',
            fontSize: '14px',
            color: colors[2] || '#FAE3AC',
            fontFamily: 'var(--font-handwriting)',
            fontWeight: '400',
            letterSpacing: '0.05em',
            lineHeight: 1.2
          }}>
            <div style={{ marginBottom: '2px' }}>DAILY PORTFOLIO</div>
            <div>— SHARE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
// Main App Component with optimized layout
function App() {
  const [palettes, setPalettes] = useState(PRESETS);
  const [selectedCard, setSelectedCard] = useState('p8'); // 柔和
  const [uploadedImage, setUploadedImage] = useState(null);
  const [moodWord, setMoodWord] = useState('');
  const [themeWord, setThemeWord] = useState('种宠物之家温馨感');
  const [isImageLoaded, setIsImageLoaded] = useState(true);
  const [cardName, setCardName] = useState('柔和');
  const [cardNumber, setCardNumber] = useState('3');
  const [posterTheme, setPosterTheme] = useState('种宠物之家温馨感');
  const [fontStyle, setFontStyle] = useState('柔和');
  const [isFullScreenModal, setIsFullScreenModal] = useState(false);
  
  // 控制台显示/隐藏状态
  const [isConsoleVisible, setIsConsoleVisible] = useState(true);

  // 使用useMemo确保selectedPalette正确响应palettes变化
  const selectedPalette = useMemo(() => {
    return palettes.find(p => p.id === selectedCard);
  }, [palettes, selectedCard]);

  const handleCardClick = (id) => {
    setSelectedCard(id);
    const card = palettes.find(p => p.id === id);
    if (card) {
      setCardName(card.name);
      setCardNumber(card.number);
      setPosterTheme(card.title);
      setFontStyle(card.mood);
    }
  };
  
  const handleCardDoubleClick = (id) => {
    setIsFullScreenModal(true);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreenModal(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target.result;
        setUploadedImage(imageDataUrl);
        setIsImageLoaded(true);
        
        // Update the selected card with the uploaded image
        setPalettes(prev => prev.map(palette => {
          if (palette.id === selectedCard) {
            return { ...palette, image: imageDataUrl };
          }
          return palette;
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 处理拖拽上传
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target.result;
        setUploadedImage(imageDataUrl);
        setIsImageLoaded(true);
        
        // Update the selected card with the uploaded image
        setPalettes(prev => prev.map(palette => {
          if (palette.id === selectedCard) {
            return { ...palette, image: imageDataUrl };
          }
          return palette;
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 意境词到颜色风格的映射
  const moodToColorStyle = {
    '温馨': { brightness: 0.1, saturation: 0.2 },
    '活力': { brightness: 0.2, saturation: 0.3 },
    '科技感': { brightness: -0.1, saturation: 0.1 },
    '简约': { brightness: 0.1, saturation: -0.2 },
    '自然': { brightness: 0.05, saturation: 0.1 },
    '奢华': { brightness: -0.05, saturation: 0.2 },
    '清新': { brightness: 0.15, saturation: 0.1 },
    '沉稳': { brightness: -0.1, saturation: -0.1 },
    '浪漫': { brightness: 0.1, saturation: 0.2 },
    '复古': { brightness: -0.05, saturation: 0.15 }
  };

  // 主题词到颜色方案的映射
  const themeToColorSchemes = {
    '宠物': ['#FFB6C1', '#87CEEB', '#98FB98'],
    '科技': ['#1E90FF', '#00CED1', '#FFD700'],
    '自然': ['#228B22', '#90EE90', '#F0E68C'],
    '美食': ['#FF6347', '#FFD700', '#98D8C8'],
    '旅行': ['#4682B4', '#FFA500', '#32CD32'],
    '时尚': ['#FF69B4', '#4169E1', '#FFD700'],
    '儿童': ['#FF6B6B', '#4ECDC4', '#45B7D1'],
    '商务': ['#2C3E50', '#3498DB', '#E74C3C'],
    '艺术': ['#9B59B6', '#E67E22', '#1ABC9C'],
    '运动': ['#E74C3C', '#3498DB', '#2ECC71']
  };

  // 从主题词中提取关键词
  const extractKeywords = (text) => {
    const keywords = Object.keys(themeToColorSchemes);
    return keywords.find(keyword => text.includes(keyword));
  };

  // 根据意境词调整颜色
  const adjustColorsByMood = (colors, moodWord) => {
    const style = moodToColorStyle[moodWord] || { brightness: 0, saturation: 0 };
    
    return colors.map(color => {
      // 将十六进制颜色转换为RGB
      const [r, g, b] = color.match(/\w\w/g).map(hex => parseInt(hex, 16));
      
      // 转换为HSL
      let [h, s, l] = rgbToHsl(r, g, b);
      
      // 根据意境词调整亮度和饱和度
      l = Math.max(0, Math.min(1, l + style.brightness));
      s = Math.max(0, Math.min(1, s + style.saturation));
      
      // 转换回RGB
      const [newR, newG, newB] = hslToRgb(h, s, l);
      
      // 转换回十六进制
      return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
    });
  };

  // RGB转HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return [h, s, l];
  };

  // HSL转RGB
  const hslToRgb = (h, s, l) => {
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  // 从图片中提取主要颜色的函数
  const extractColorsFromImage = (imageUrl, callback, moodWord = '') => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // 创建Canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // 缩小图片尺寸，提高处理速度
      const maxSize = 100;
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // 绘制图片到Canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // 获取像素数据
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      // 统计颜色出现频率
      const colorCounts = {};
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        
        // 跳过透明像素
        if (a < 128) continue;
        
        // 将颜色量化为6位十六进制值
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }
      
      // 排序颜色，获取最常见的颜色
      const sortedColors = Object.entries(colorCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([color]) => color);
      
      // 获取主要颜色，确保颜色差异明显
      const mainColors = [];
      for (const color of sortedColors) {
        // 检查与已选颜色的差异
        const isDifferent = mainColors.every(existingColor => {
          // 简单的颜色差异检查
          const [r1, g1, b1] = existingColor.match(/\w\w/g).map(hex => parseInt(hex, 16));
          const [r2, g2, b2] = color.match(/\w\w/g).map(hex => parseInt(hex, 16));
          const diff = Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2));
          return diff > 50; // 颜色差异阈值
        });
        
        if (isDifferent) {
          mainColors.push(color);
          if (mainColors.length === 3) break;
        }
      }
      
      // 如果没有足够的差异颜色，使用默认颜色
      while (mainColors.length < 3) {
        mainColors.push(`#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`);
      }
      
      // 根据意境词调整颜色
      const adjustedColors = adjustColorsByMood(mainColors, moodWord);
      
      callback(adjustedColors);
    };
    img.onerror = () => {
      console.error('Failed to load image for color extraction');
      // 使用默认颜色
      const defaultColors = ['#FF6B6B', '#4ECDC4', '#45B7D1'];
      const adjustedColors = adjustColorsByMood(defaultColors, moodWord);
      callback(adjustedColors);
    };
    img.src = imageUrl;
  };

  const handleStartImageAnalysis = () => {
    // AI image analysis logic would go here
    console.log('Starting image analysis with:', {
      moodWord,
      themeWord,
      uploadedImage
    });
    
    if (uploadedImage) {
      // 从图片中提取颜色
      extractColorsFromImage(uploadedImage, (extractedColors) => {
        console.log('Extracted colors from image:', extractedColors);
        
        // 更新选中卡片的配色
        setPalettes(prev => prev.map(palette => {
          if (palette.id === selectedCard) {
            return { ...palette, colors: extractedColors };
          }
          return palette;
        }));
      }, moodWord);
    } else if (themeWord) {
      // 根据主题词生成配色方案
      const keyword = extractKeywords(themeWord);
      let themeColors = themeToColorSchemes[keyword] || ['#FF6B6B', '#4ECDC4', '#45B7D1'];
      
      // 根据意境词调整颜色
      const adjustedColors = adjustColorsByMood(themeColors, moodWord);
      
      console.log('Generated colors from theme:', adjustedColors);
      
      // 更新选中卡片的配色
      setPalettes(prev => prev.map(palette => {
        if (palette.id === selectedCard) {
          return { ...palette, colors: adjustedColors };
        }
        return palette;
      }));
    }
  };

  // 处理卡片信息更新
  const handleCardInfoChange = (field, value) => {
    setPalettes(prev => prev.map(palette => {
      if (palette.id === selectedCard) {
        return { ...palette, [field]: value };
      }
      return palette;
    }));
    
    // 更新本地状态
    if (field === 'number') setCardNumber(value);
    if (field === 'name') setCardName(value);
    if (field === 'title') setPosterTheme(value);
    if (field === 'mood') setFontStyle(value);
  };

  // 处理配色方案更新
  const handleColorChange = (index, color) => {
    setPalettes(prev => prev.map(palette => {
      if (palette.id === selectedCard) {
        const newColors = [...palette.colors];
        newColors[index] = color;
        return { ...palette, colors: newColors };
      }
      return palette;
    }));
  };

  // 新增空白卡片
  const handleAddCard = () => {
    const newCard = {
      id: `p${Date.now()}`,
      name: '新卡片',
      number: '0',
      title: '新配色',
      mood: '新风格',
      colors: ['#F0F0F0', '#E0E0E0', '#D0D0D0'],
      image: '',
      textColor: '#000000'
    };
    
    setPalettes(prev => [...prev, newCard]);
    setSelectedCard(newCard.id);
    setCardName(newCard.name);
    setCardNumber(newCard.number);
    setPosterTheme(newCard.title);
    setFontStyle(newCard.mood);
  };

  // 删除当前卡片
  const handleDeleteCard = () => {
    if (palettes.length > 1) {
      setPalettes(prev => prev.filter(palette => palette.id !== selectedCard));
      // 选择第一个可用卡片
      const firstCard = palettes.find(palette => palette.id !== selectedCard);
      if (firstCard) {
        setSelectedCard(firstCard.id);
        setCardName(firstCard.name);
        setCardNumber(firstCard.number);
        setPosterTheme(firstCard.title);
        setFontStyle(firstCard.mood);
        setUploadedImage(firstCard.image || null);
      }
    }
  };

  return (
    <div className="App" style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      color: '#333333',
      display: 'flex',
      fontFamily: 'var(--font-sans)', /* 使用粗体无衬线字体 */
      fontWeight: '700'
    }}>
      {/* Console Toggle Button - Visible when console is hidden */}
      {!isConsoleVisible && (
        <button
          onClick={() => setIsConsoleVisible(true)}
          style={{
            position: 'fixed',
            left: '10px',
            top: '20px',
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: '#6366f1',
            border: 'none',
            color: '#ffffff',
            fontSize: '18px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
          }}
        >
          →
        </button>
      )}
      
      {/* Left Panel - Card Editor Console */}
      <div style={{
        width: isConsoleVisible ? '380px' : '0',
        backgroundColor: '#ffffff',
        padding: isConsoleVisible ? '20px' : '0',
        borderRight: '1px solid #e4e7ed',
        height: '100vh',
        overflowY: 'auto',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
        transition: 'width 0.3s ease',
        overflowX: 'hidden',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Palette size={18} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px', fontFamily: 'var(--font-display)', textTransform: 'none' }}>卡片编辑与控制台</h1>
          </div>
          <button
            onClick={() => setIsConsoleVisible(!isConsoleVisible)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e2e8f0';
              e.target.style.color = '#475569';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f1f5f9';
              e.target.style.color = '#64748b';
            }}
          >
            {isConsoleVisible ? '←' : '→'}
          </button>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', color: '#666666', marginBottom: '6px' }}>当前正在编辑：</div>
          <span style={{ fontSize: '16px', color: '#6366f1', fontWeight: '800', letterSpacing: '-0.5px' }}>{selectedPalette?.name || '未选择'}</span>
        </div>

        {/* AI Smart Coloring / Image Analysis Section */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px'
            }}>
              <Zap size={16} style={{ color: '#6366f1' }} />
              <h3 style={{ fontSize: '14px', fontWeight: '800', margin: 0, fontFamily: 'var(--font-bold)', letterSpacing: '-0.3px' }}>AI 智能配色 / 图片分析</h3>
              <span style={{ fontSize: '12px', color: '#f59e0b' }}>✨</span>
            </div>
          <p style={{ fontSize: '12px', fontWeight: '700', color: '#666666', marginBottom: '12px', fontFamily: 'var(--font-sans)', letterSpacing: '-0.2px' }}>
            输入主题词或上传图片，AI 为您生成一套配色方案。
          </p>

          {/* Image Upload Section */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#666666', marginBottom: '6px', fontFamily: 'var(--font-sans)', letterSpacing: '-0.2px' }}>上传图片</div>
            <div style={{
              border: '2px dashed #d0d0d0',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: '#ffffff',
              transition: 'all 0.2s'
            }}
            onClick={() => document.getElementById('image-upload').click()}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#6366f1';
              e.target.style.backgroundColor = '#f0f4ff';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#d0d0d0';
              e.target.style.backgroundColor = '#ffffff';
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}>
              <input 
                type="file" 
                id="image-upload" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleImageUpload}
              />
              {uploadedImage ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    marginBottom: '8px'
                  }}>
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '12px', color: '#666666' }}>已上传图片</div>
                  <button 
                    type="button"
                    style={{
                      padding: '4px 12px',
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => {
                      setUploadedImage(null);
                      // Remove image from selected card
                      setPalettes(prev => prev.map(palette => {
                        if (palette.id === selectedCard) {
                          return { ...palette, image: '' };
                        }
                        return palette;
                      }));
                    }}
                  >
                    移除
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <Upload size={24} style={{ color: '#999' }} />
                  <div style={{ fontSize: '12px', color: '#666666' }}>点击或拖拽上传图片</div>
                  <div style={{ fontSize: '10px', color: '#999' }}>支持 JPG、PNG、SVG 格式</div>
                </div>
              )}
            </div>
          </div>

          {/* Image Status */}
          {isImageLoaded && uploadedImage && (
            <div style={{
              backgroundColor: '#dcfce7',
              color: '#166534',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Check size={14} />
              已载入图片，将进行图片分析
            </div>
          )}

          {/* Input Fields */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#666666', marginBottom: '6px' }}>主题词</div>
            <input 
              type="text" 
              placeholder="输入主题词" 
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #d0d0d0',
                fontSize: '14px',
                boxSizing: 'border-box',
                marginBottom: '8px'
              }}
              value={themeWord}
              onChange={(e) => setThemeWord(e.target.value)}
            />
            <div style={{ fontSize: '12px', color: '#666666', marginBottom: '6px' }}>意境词</div>
            <input 
              type="text" 
              placeholder="输入意境词（如：温馨、活力、科技感）" 
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #d0d0d0',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              value={moodWord}
              onChange={(e) => setMoodWord(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: (uploadedImage || themeWord) ? '#6366f1' : '#9ca3af',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: (uploadedImage || themeWord) ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s',
                opacity: (uploadedImage || themeWord) ? 1 : 0.7
              }}
              onMouseEnter={(e) => {
                if (uploadedImage || themeWord) {
                  e.target.style.backgroundColor = '#4f46e5';
                }
              }}
              onMouseLeave={(e) => {
                if (uploadedImage || themeWord) {
                  e.target.style.backgroundColor = '#6366f1';
                }
              }}
              onClick={handleStartImageAnalysis}
              disabled={!uploadedImage && !themeWord}
            >
              开始智能分析
            </button>
          </div>
        </div>

        {/* Card Management Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          {/* Add New Card Button */}
          <button 
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e2e8f0';
              e.target.style.color = '#475569';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f1f5f9';
              e.target.style.color = '#64748b';
            }}
            onClick={handleAddCard}
          >
            <ImagePlus size={14} />
            新增空白卡片
          </button>
          
          {/* Delete Card Button */}
          <button 
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fee2e2',
              borderRadius: '8px',
              cursor: palettes.length > 1 ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              opacity: palettes.length > 1 ? 1 : 0.7
            }}
            onMouseEnter={(e) => {
              if (palettes.length > 1) {
                e.target.style.backgroundColor = '#fee2e2';
                e.target.style.color = '#b91c1c';
              }
            }}
            onMouseLeave={(e) => {
              if (palettes.length > 1) {
                e.target.style.backgroundColor = '#fef2f2';
                e.target.style.color = '#dc2626';
              }
            }}
            onClick={handleDeleteCard}
            disabled={palettes.length <= 1}
          >
            <X size={14} />
            删除当前卡片
          </button>
        </div>

        {/* Card Information Section */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>卡片信息</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#666666', marginBottom: '4px' }}>索引数字</div>
              <input 
                type="text" 
                value={cardNumber}
                onChange={(e) => handleCardInfoChange('number', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #d0d0d0',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666666', marginBottom: '4px' }}>卡片名称</div>
              <input 
                type="text" 
                value={cardName}
                onChange={(e) => handleCardInfoChange('name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #d0d0d0',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </div>

        {/* Smart Fill Button */}
        <div style={{ marginBottom: '20px' }}>
          <button
            style={{
              width: '100%',
              padding: '8px 12px',
              backgroundColor: '#f0f4ff',
              color: '#6366f1',
              border: '1px solid #e0e7ff',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e0e7ff';
              e.target.style.borderColor = '#c7d2fe';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f0f4ff';
              e.target.style.borderColor = '#e0e7ff';
            }}
            onClick={() => {
              // 智能填写逻辑
              const keyword = extractKeywords(themeWord);
              const index = parseInt(cardNumber) || Math.floor(Math.random() * 100);
              
              // 根据主题词和意境词生成智能内容
              const smartCardName = `${moodWord || '简约'}${keyword || themeWord || '设计'}`;
              const smartPosterTheme = themeWord || keyword || '新设计';
              const smartFontStyle = moodWord || '简约';
              
              // 更新状态
              setCardNumber(index.toString());
              setCardName(smartCardName);
              setPosterTheme(smartPosterTheme);
              setFontStyle(smartFontStyle);
              
              // 更新选中卡片的信息
              setPalettes(prev => prev.map(palette => {
                if (palette.id === selectedCard) {
                  return {
                    ...palette,
                    number: index.toString(),
                    name: smartCardName,
                    title: smartPosterTheme,
                    mood: smartFontStyle
                  };
                }
                return palette;
              }));
            }}
          >
            智能填写卡片信息
          </button>
        </div>

        {/* Poster Information Section */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>海报信息</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#666666', marginBottom: '4px' }}>海报主题</div>
              <input 
                type="text" 
                value={posterTheme}
                onChange={(e) => handleCardInfoChange('title', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #d0d0d0',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666666', marginBottom: '4px' }}>氛围关键词</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: '#666666', marginRight: '6px', display: 'flex', alignItems: 'center' }}>T</span>
                <input 
                  type="text" 
                  value={fontStyle}
                  onChange={(e) => handleCardInfoChange('mood', e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #d0d0d0',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Color Scheme Section */}
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>配色方案（主色/辅助色/辅助色）</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            {selectedPalette?.colors.slice(0, 3).map((color, index) => (
              <div key={index} style={{ flex: 1 }}>
                <div style={{
                  width: '100%',
                  height: '40px',
                  backgroundColor: color,
                  borderRadius: '8px',
                  marginBottom: '6px',
                  border: '1px solid #e0e0e0',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}></div>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid #d0d0d0',
                    fontSize: '12px',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                    color: '#666666',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6366f1';
                    e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d0d0d0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Pattern Preview */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        backgroundColor: '#fafafa'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              backgroundColor: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <ImageIcon size={16} />
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>图案预览 | 色彩搭配</h2>
          </div>
          <button style={{
            background: 'none',
            border: '1px solid #d0d0d0',
            borderRadius: '6px',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#666666',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.borderColor = '#6366f1'}
          onMouseLeave={(e) => e.target.style.borderColor = '#d0d0d0'}>
            <Maximize size={14} />
            切换视图
          </button>
        </div>

        {/* Pattern Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {palettes.map(palette => (
            <ColorCard
              key={palette.id}
              data={palette}
              onClick={() => handleCardClick(palette.id)}
              onDoubleClick={() => handleCardDoubleClick(palette.id)}
              isSelected={selectedCard === palette.id}
            />
          ))}
        </div>
      </div>

      {/* Full Screen Modal */}
      {isFullScreenModal && selectedCard && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '20px'
        }}>
          <button
            onClick={handleCloseFullScreen}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: '#333333',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#555555'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#333333'}
          >
            <X size={20} />
          </button>
          <div>
            {palettes.map(palette => (
              palette.id === selectedCard && (
                <ColorCard
                  key={palette.id}
                  data={palette}
                  isFullScreen={true}
                />
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;