# パフォーマンス最適化ガイド

## 目次
1. [現状分析](#現状分析)
2. [Core Web Vitals最適化](#core-web-vitals最適化)
3. [Next.js 15固有の最適化](#nextjs-15固有の最適化)
4. [画像最適化](#画像最適化)
5. [コード分割とバンドル最適化](#コード分割とバンドル最適化)
6. [キャッシング戦略](#キャッシング戦略)
7. [アニメーション最適化](#アニメーション最適化)
8. [測定とモニタリング](#測定とモニタリング)

## 現状分析

### 技術スタック
- **Framework**: Next.js 15 (App Router + Turbopack)
- **Styling**: Tailwind CSS v4
- **CMS**: microCMS
- **Animation**: GSAP
- **Deployment**: Vercel

### パフォーマンスボトルネック特定
1. **初回読み込み時間**
   - JavaScriptバンドルサイズ
   - CSSの読み込み
   - フォントの読み込み

2. **ランタイムパフォーマンス**
   - GSAPアニメーション
   - 画像の遅延読み込み
   - APIリクエスト

## Core Web Vitals最適化

### LCP (Largest Contentful Paint)
目標: < 2.5秒

```typescript
// src/app/page.tsx - ヒーローセクションの最適化
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// クリティカルコンポーネントは静的インポート
import Hero from '@/components/Hero';

// 非クリティカルコンポーネントは動的インポート
const Projects = dynamic(() => import('@/components/Projects'), {
  loading: () => <ProjectsSkeleton />,
  ssr: true
});

export default function Home() {
  return (
    <>
      {/* LCPに影響する要素を優先的にレンダリング */}
      <Hero priority={true} />
      <Suspense fallback={<ProjectsSkeleton />}>
        <Projects />
      </Suspense>
    </>
  );
}
```

### FID (First Input Delay) / INP (Interaction to Next Paint)
目標: < 100ms

```typescript
// src/hooks/useDebounce.ts - 入力遅延の最適化
import { useCallback, useRef } from 'react';

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
}

// 使用例: 検索入力の最適化
const handleSearch = useDebounce((query: string) => {
  // 重い処理
}, 300);
```

### CLS (Cumulative Layout Shift)
目標: < 0.1

```typescript
// src/components/ProjectCard.tsx - レイアウトシフト防止
import Image from 'next/image';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="relative aspect-video">
      {/* アスペクト比を固定してレイアウトシフトを防ぐ */}
      <Image
        src={project.mainVisual.url}
        alt={project.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
        placeholder="blur"
        blurDataURL={project.mainVisual.blurDataURL}
      />
    </div>
  );
}
```

## Next.js 15固有の最適化

### Turbopackの活用
```javascript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Turbopackの最適化オプション
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // Partial Prerenderingの有効化
    ppr: true,
  },
  
  // コンパイラ最適化
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
    // React Server Components最適化
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
```

### React Server Components (RSC)の活用
```typescript
// src/app/projects/page.tsx - サーバーコンポーネント
import { getProjects } from '@/lib/microcms';
import ProjectList from '@/components/ProjectList';

// データフェッチをサーバー側で実行
export default async function ProjectsPage() {
  const projects = await getProjects();
  
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-8">Projects</h1>
      {/* クライアントコンポーネントに最小限のデータを渡す */}
      <ProjectList projects={projects} />
    </div>
  );
}

// キャッシュの設定
export const revalidate = 3600; // 1時間ごとに再検証
```

### Streaming SSRの実装
```typescript
// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-200 rounded-lg mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  );
}

// src/app/projects/[id]/page.tsx
import { Suspense } from 'react';
import ProjectDetail from '@/components/ProjectDetail';
import ProjectDetailSkeleton from '@/components/ProjectDetailSkeleton';

export default function ProjectPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<ProjectDetailSkeleton />}>
      <ProjectDetail id={params.id} />
    </Suspense>
  );
}
```

## 画像最適化

### Next.js Image最適化
```typescript
// src/lib/imageOptimization.ts
import { getPlaiceholder } from 'plaiceholder';

export async function getOptimizedImage(src: string) {
  try {
    const { base64, img } = await getPlaiceholder(src);
    
    return {
      ...img,
      blurDataURL: base64,
    };
  } catch (error) {
    console.error('画像最適化エラー:', error);
    return { src };
  }
}

// src/components/OptimizedImage.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export function OptimizedImage({ src, alt, priority = false }: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <div className="relative overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={90}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        onLoad={() => setIsLoading(false)}
        className={`
          object-cover transition-opacity duration-300
          ${isLoading ? 'opacity-0' : 'opacity-100'}
        `}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}
```

### 画像フォーマット最適化
```typescript
// src/lib/microcms.ts - WebP/AVIF変換
export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    format?: 'webp' | 'avif';
    quality?: number;
  } = {}
): string {
  const params = new URLSearchParams();
  
  if (options.width) params.append('w', options.width.toString());
  if (options.height) params.append('h', options.height.toString());
  if (options.format) params.append('fm', options.format);
  if (options.quality) params.append('q', options.quality.toString());
  
  return `${url}?${params.toString()}`;
}
```

## コード分割とバンドル最適化

### 動的インポート戦略
```typescript
// src/components/HeavyComponent.tsx
import dynamic from 'next/dynamic';

// 重いライブラリの動的インポート
const HeavyChart = dynamic(
  () => import('recharts').then((mod) => mod.LineChart),
  {
    ssr: false,
    loading: () => <div>Loading chart...</div>
  }
);

// 条件付き動的インポート
export function ConditionalComponent({ showChart }: { showChart: boolean }) {
  if (!showChart) return null;
  
  return <HeavyChart />;
}
```

### バンドル分析と最適化
```javascript
// next.config.ts - バンドル分析設定
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (process.env.ANALYZE === 'true') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        })
      );
    }
    
    // Tree shakingの最適化
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
    };
    
    return config;
  },
};
```

### ライブラリの最適化
```typescript
// src/lib/gsapOptimized.ts - GSAPの選択的インポート
// 必要なプラグインのみインポート
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 使用するプラグインのみ登録
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

// 使用しない機能の削除
// ❌ import { gsap } from 'gsap/all';
// ✅ import { gsap } from 'gsap';
```

## キャッシング戦略

### データキャッシング
```typescript
// src/lib/cache.ts - インメモリキャッシュ
class DataCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private ttl = 1000 * 60 * 5; // 5分
  
  set(key: string, data: any, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + (ttl || this.ttl)
    });
  }
  
  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.timestamp) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  clear(): void {
    this.cache.clear();
  }
}

export const dataCache = new DataCache();

// src/lib/microcms.ts - キャッシュ付きフェッチ
import { dataCache } from './cache';

export async function getProjectsCached(): Promise<Project[]> {
  const cacheKey = 'projects';
  const cached = dataCache.get(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  const projects = await getProjects();
  dataCache.set(cacheKey, projects);
  
  return projects;
}
```

### ブラウザキャッシング
```typescript
// src/app/layout.tsx - メタデータ設定
export const metadata = {
  other: {
    'Cache-Control': 'public, max-age=31536000, immutable',
  },
};

// public/_headers - 静的アセットのキャッシング
/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400
```

### Service Workerの実装
```javascript
// public/sw.js
const CACHE_NAME = 'portfolio-v1';
const urlsToCache = [
  '/',
  '/styles/globals.css',
  '/fonts/inter-var.woff2',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュがあればそれを返す
        if (response) {
          return response;
        }
        
        // なければネットワークから取得
        return fetch(event.request).then((response) => {
          // 有効なレスポンスのみキャッシュ
          if (!response || response.status !== 200) {
            return response;
          }
          
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
  );
});
```

## アニメーション最適化

### GSAP最適化
```typescript
// src/hooks/useGSAPOptimized.ts
import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from '@/lib/gsapOptimized';

const useIsomorphicLayoutEffect = 
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useGSAPOptimized(
  animation: (ctx: gsap.Context) => void,
  deps: any[] = []
) {
  const ref = useRef<HTMLDivElement>(null);
  
  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    
    const ctx = gsap.context(() => {
      // will-changeの設定
      gsap.set(ref.current, { willChange: 'transform' });
      
      // アニメーションの実行
      animation(ctx);
    }, ref.current);
    
    return () => {
      // クリーンアップ時にwill-changeを削除
      gsap.set(ref.current, { willChange: 'auto' });
      ctx.revert();
    };
  }, deps);
  
  return ref;
}
```

### CSS アニメーション最適化
```css
/* src/styles/animations.css */
@layer utilities {
  /* GPU加速を使用 */
  .animate-optimized {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
  
  /* 複雑なアニメーションにcontain使用 */
  .animation-container {
    contain: layout style paint;
  }
  
  /* パフォーマンスの良いプロパティのみ使用 */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* レイアウトを引き起こさないアニメーション */
  .hover-scale {
    transition: transform 0.3s ease;
  }
  
  .hover-scale:hover {
    transform: scale(1.05);
  }
}
```

### Intersection Observerによる遅延アニメーション
```typescript
// src/hooks/useIntersectionAnimation.ts
import { useEffect, useRef, useState } from 'react';

interface Options {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionAnimation(
  options: Options = {}
) {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          
          if (options.triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!options.triggerOnce) {
          setIsInView(false);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
      }
    );
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin, options.triggerOnce]);
  
  return { ref, isInView };
}
```

## 測定とモニタリング

### Lighthouse CI設定
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

### Lighthouse設定
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/projects',
        'http://localhost:3000/about'
      ],
      numberOfRuns: 3,
      startServerCommand: 'npm start',
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

### Real User Monitoring (RUM)
```typescript
// src/lib/analytics.ts
export class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();
  
  constructor() {
    if (typeof window === 'undefined') return;
    
    // Web Vitalsの測定
    this.measureWebVitals();
    
    // カスタムメトリクスの測定
    this.measureCustomMetrics();
  }
  
  private measureWebVitals() {
    // LCP測定
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.set('lcp', lastEntry.startTime);
      this.reportMetric('lcp', lastEntry.startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    
    // FID測定
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'first-input') {
          const fid = entry.processingStart - entry.startTime;
          this.metrics.set('fid', fid);
          this.reportMetric('fid', fid);
        }
      });
    }).observe({ type: 'first-input', buffered: true });
    
    // CLS測定
    let clsValue = 0;
    let clsEntries: PerformanceEntry[] = [];
    
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      });
      this.metrics.set('cls', clsValue);
      this.reportMetric('cls', clsValue);
    }).observe({ type: 'layout-shift', buffered: true });
  }
  
  private measureCustomMetrics() {
    // ナビゲーションタイミング
    if (performance.timing) {
      const timing = performance.timing;
      const metrics = {
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        ttfb: timing.responseStart - timing.navigationStart,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        load: timing.loadEventEnd - timing.navigationStart,
      };
      
      Object.entries(metrics).forEach(([key, value]) => {
        this.metrics.set(key, value);
        this.reportMetric(key, value);
      });
    }
  }
  
  private reportMetric(name: string, value: number) {
    // Analyticsへの送信
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'performance', {
        event_category: 'Web Vitals',
        event_label: name,
        value: Math.round(value),
        non_interaction: true,
      });
    }
    
    // コンソールログ（開発環境）
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metric - ${name}: ${value}ms`);
    }
  }
  
  public getMetrics() {
    return Object.fromEntries(this.metrics);
  }
}

// src/app/layout.tsx での使用
'use client';

import { useEffect } from 'react';
import { PerformanceMonitor } from '@/lib/analytics';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const monitor = new PerformanceMonitor();
    
    // ページ離脱時にメトリクスを送信
    window.addEventListener('beforeunload', () => {
      const metrics = monitor.getMetrics();
      // Beacon APIを使用して確実に送信
      navigator.sendBeacon('/api/metrics', JSON.stringify(metrics));
    });
  }, []);
  
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
```

## パフォーマンス改善チェックリスト

### 初期設定
- [ ] Turbopackの有効化
- [ ] 画像最適化の設定（next/image）
- [ ] フォント最適化（next/font）
- [ ] 環境変数の設定確認

### コード最適化
- [ ] 不要な依存関係の削除
- [ ] 動的インポートの実装
- [ ] React Server Componentsの活用
- [ ] Suspenseとストリーミングの実装
- [ ] メモ化（useMemo, useCallback）の適切な使用

### アセット最適化
- [ ] 画像の最適化（WebP/AVIF変換）
- [ ] フォントのサブセット化
- [ ] CSSの最小化
- [ ] JavaScriptの最小化

### キャッシング
- [ ] ブラウザキャッシングの設定
- [ ] CDNの設定
- [ ] Service Workerの実装
- [ ] データキャッシングの実装

### 測定と監視
- [ ] Lighthouse CIの設定
- [ ] Real User Monitoring
- [ ] エラー監視
- [ ] パフォーマンスバジェットの設定

### デプロイメント
- [ ] Vercelの最適化設定
- [ ] Edge Functionsの活用
- [ ] ISRの設定
- [ ] 画像最適化APIの設定

## トラブルシューティング

### よくある問題と解決策

1. **大きなバンドルサイズ**
   - `npm run analyze`でバンドル分析
   - 不要な依存関係の削除
   - Tree shakingの確認

2. **遅い初回ロード**
   - Critical CSSの抽出
   - プリロード/プリフェッチの設定
   - コード分割の改善

3. **レイアウトシフト**
   - 画像/動画のサイズ指定
   - フォントの最適化
   - スケルトンスクリーンの実装

4. **メモリリーク**
   - イベントリスナーの適切なクリーンアップ
   - タイマーのクリア
   - Observerの切断

## まとめ

パフォーマンス最適化は継続的なプロセスです。定期的な測定と改善を行い、ユーザー体験を向上させましょう。

### 優先順位
1. **高優先度**: Core Web Vitals（LCP, FID/INP, CLS）
2. **中優先度**: バンドルサイズ、キャッシング
3. **低優先度**: 詳細な最適化、エッジケース

### 次のステップ
1. Lighthouse CIの導入
2. パフォーマンスバジェットの設定
3. A/Bテストによる効果測定
4. 継続的な監視とアラート設定