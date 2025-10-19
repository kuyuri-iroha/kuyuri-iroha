const { createClient } = require('microcms-js-sdk');
require('dotenv').config({ path: '.env.local' });

// microCMSのクライアントを作成
const client = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN || 'kuyuri-iroha',
  apiKey: process.env.NEXT_PUBLIC_MICROCMS_API_KEY || '',
});

// プロジェクトの概要を取得
async function fetchProjectSummaries() {
  try {
    const data = await client.get({
      endpoint: 'projects',
      queries: {
        limit: 100,
        orders: '-date',
        fields: 'id,title,description,date,genre,skill,url,github'
      },
    });
    
    console.log('=== プロジェクト概要一覧 ===\n');
    
    data.contents.forEach((project, index) => {
      console.log(`【プロジェクト ${index + 1}】`);
      console.log(`タイトル: ${project.title}`);
      console.log(`説明: ${project.description.replace(/<[^>]*>/g, '').substring(0, 200)}...`);
      if (project.date) console.log(`日付: ${project.date}`);
      if (project.genre && project.genre.length > 0) console.log(`ジャンル: ${project.genre.join(', ')}`);
      if (project.skill && project.skill.length > 0) console.log(`スキル: ${project.skill.join(', ')}`);
      if (project.url) console.log(`URL: ${project.url}`);
      if (project.github) console.log(`GitHub: ${project.github}`);
      console.log('-'.repeat(50) + '\n');
    });
    
    console.log(`合計 ${data.contents.length} 件のプロジェクト`);
    
  } catch (error) {
    console.error('プロジェクト取得エラー:', error);
  }
}

fetchProjectSummaries();