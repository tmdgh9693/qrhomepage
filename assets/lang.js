(() => {
    const translations = {
        ko: {
            documentTitle: '섬 따라 등대 한바퀴 안내 홈페이지',
            description: '섬 따라 등대 한바퀴 안내 홈페이지',
            homeAria: '홈으로 이동', skip: '본문 바로가기', tourTitle: '섬 따라 등대 한바퀴',
            language: '언어', fontSize: '글자 크기', fontGroup: '글자 크기 설정',
            small: '작게', normal: '중간', large: '크게',
            welcome: 'WELCOME', heroTitle: '섬 따라 등대 한바퀴 안내 홈페이지',
            heroText: '공지사항과 이용 안내를 확인하시고, 궁금하거나 불편사항, 민원이 있으시면 오픈 카톡으로 문의해주세요!',
            kakaoTitle: '오픈카톡 바로가기', kakaoText: '문의사항을 남겨주세요.', directions: '찾아오는 길',
            directionsText: '6개 방문 위치를 지도 앱으로 확인하세요.',
            // 안내문
            guide: '안내문',
            giftTitle: '기념품 안내', giftText: '오동도등대를 방문하여 기념품을 수령하실 수 있습니다.',
            timeTitle: '방문 시간 안내', timeText: '오동도 등대는 18시 이후에 방문하실 수 없습니다. 시간 확인 후 18시 이전에 방문하시길 바랍니다.',
            // 공지사항
            notice: '공지사항', important: '중요', passportPlace: '종이 여권 수령 장소',
            passportPlaceText: '여수 세계 섬 박람회 장소, 오동도 등대, 여수 연안 여객선 터미널',
            passportPlaceText2: '여수 구항등대는 근처에서 사진 촬영만 가능하며, 등대 내부는 방문하실 수 없습니다.',
            // 주의사항
            caution: '주의사항',
            caution1: 'QR 코드는 공식 안내 장소에 부착된 것만 이용해 주세요.',
            caution2: '네트워크 상태에 따라 페이지 연결이 늦어질 수 있습니다.',
            caution3: '개인정보나 민감한 정보는 오픈카톡에 남기지 마세요.',
            caution4: '운영 상황에 따라 안내 내용이 변경될 수 있으니 최신 공지를 확인해 주세요.',
            caution5: '상품은 1인 1회만 수령 가능하며 중복 수령은 불가합니다.',
            caution6: '상품은 선착순으로 제공되며, 모두 소진되면 수령하지 못할 수 있습니다.',
            caution7: '대리 수령 및 대리로 스탬프를 찍어주는 행위는 불가합니다.',
            // 하단탭
            navMain: '주요 메뉴', home: '홈', navGuide: '안내', navNotice: '공지', navCaution: '주의', navDirections: '길찾기', footer: '© 여수지방해양수산청',
            backHome: '← 홈으로 돌아가기',
            // 네비게이션
            directionsTitle: '찾아오는 길', directionsIntro: '방문할 위치를 선택한 뒤 사용 중인 지도 앱을 눌러주세요. 앱이 설치되어 있지 않으면 웹 지도로 연결됩니다.',
            locationsAria: '방문 위치 6곳', mapChoice: '지도 앱 선택', kakaoMap: '카카오맵', naverMap: '네이버지도', googleMap: '구글 지도',
            // 주소
            loc1: '섬박람회 주전시관', addr1: '여수시 돌산읍 진모지구(여수시 돌산읍 강남해안로 196)',
            loc2: '돌산항남방파제등대', addr2: '전라남도 여수시 돌산읍 군내리 1581',
            loc3: '여수신북항방파제등대', addr3: '전라남도 여수시 덕충동 2101',
            loc4: '여수구항방파제 하멜등대', addr4: '전라남도 여수시 종화동 458-7',
            loc5: '여수구항등대', addr5: '전라남도 여수시 교동 682-1',
            loc6: '오동도등대', addr6: '전라남도 여수시 수정동 1-7'
        },
        
        en: {
            documentTitle: 'A Lighthouse Journey Along the Islands',
            description: 'A Lighthouse Journey Along the Islands information website',
            homeAria: 'Go to home', skip: 'Skip to main content',
            tourTitle: 'A Lighthouse Journey Along the Islands',
            language: 'Language', fontSize: 'Text size', fontGroup: 'Text size settings',
            small: 'Small', normal: 'Medium', large: 'Large', welcome: 'WELCOME',
            heroTitle: 'A Lighthouse Journey Along the Islands',
            heroText: 'Please check the notices and visitor guide. For questions, inconvenience, or complaints, contact us through Open KakaoTalk.',
            kakaoTitle: 'Open KakaoTalk', kakaoText: 'Leave your inquiry here.', directions: 'Directions',
            directionsText: 'View the six visitor locations in your map app.', 
            // 안내문
            guide: 'Visitor Guide',
            giftTitle: 'Souvenir Information',
            giftText: 'You can collect your souvenir by visiting Odongdo Lighthouse.',
            timeTitle: 'Visiting Hours',
            timeText: 'Odongdo Lighthouse cannot be visited after 6:00 PM. Please check the time and arrive before 6:00 PM.',
            // 공지사항
            notice: 'Notices', important: 'Important', passportPlace: 'Paper Passport Issuance Locations',
            passportPlaceText: 'Yeosu World Island Exhibition venue, Odongdo Lighthouse, and Yeosu Coastal Passenger Terminal',
            passportPlaceText2: 'Yeosu Gugang Lighthouse is only accessible for photography outside the premises, and internal visits are not permitted.',
            // 주의사항
            caution: 'Important Notes', 
            caution1: 'Use only QR codes posted at official information locations.',
            caution2: 'The page may load slowly depending on network conditions.',
            caution3: 'Do not leave personal or sensitive information in Open KakaoTalk.',
            caution4: 'Information may change according to operating conditions, so check the latest notices.',
            caution5: 'Each person may receive a prize only once; duplicate collection is not allowed.',
            caution6: 'Prizes are provided on a first-come, first-served basis and may run out.',
            caution7: 'Proxy collection and stamping on behalf of another person are not allowed.',
            // 하단탭
            navMain: 'Main menu', home: 'Home', navGuide: 'Guide',
            navNotice: 'Notices', navCaution: 'Caution', navDirections: 'Directions',
            footer: '© Yeosu Regional Office of Oceans and Fisheries', backHome: '← Back to home',
            // 네비게이션
            directionsTitle: 'Directions',
            directionsIntro: 'Select a location, then choose your map app. If the app is not installed, the web map will open.',
            locationsAria: 'Six visitor locations', mapChoice: 'Choose a map app',
            kakaoMap: 'KakaoMap', naverMap: 'NAVER Map', googleMap: 'Google Maps',
            // 주소
            loc1: 'World Island Exhibition Main Venue', addr1: 'Jinmo District, Dolsan-eup, Yeosu (196 Gangnamhaean-ro, Dolsan-eup)',
            loc2: 'Dolsan Port South Breakwater Lighthouse', addr2: '1581 Gunnae-ri, Dolsan-eup, Yeosu, Jeollanam-do',
            loc3: 'Yeosu New North Port Breakwater Lighthouse', addr3: '2101 Deokchung-dong, Yeosu, Jeollanam-do',
            loc4: 'Hamel Lighthouse at Yeosu Old Port Breakwater', addr4: '458-7 Jonghwa-dong, Yeosu, Jeollanam-do',
            loc5: 'Yeosu Old Port Lighthouse', addr5: '682-1 Gyo-dong, Yeosu, Jeollanam-do',
            loc6: 'Odongdo Lighthouse', addr6: '1-7 Sujeong-dong, Yeosu, Jeollanam-do'
        },

        // 일본어
        ja: {
            documentTitle: '島をめぐる灯台一周',
            description: '島をめぐる灯台一周案内ホームページ',
            homeAria: 'ホームへ移動', skip: '本文へ移動', tourTitle: '島をめぐる灯台一周',
            language: '言語', fontSize: '文字サイズ', fontGroup: '文字サイズ設定',
            small: '小', normal: '中', large: '大', welcome: 'WELCOME',
            heroTitle: '島をめぐる灯台一周 案内ホームページ',
            heroText: 'お知らせと利用案内をご確認ください。ご質問、不便な点、苦情などはオープンカカオトークでお問い合わせください。',
            kakaoTitle: 'オープンカカオトーク', kakaoText: 'お問い合わせをお寄せください。',
            directions: 'アクセス', directionsText: '6か所の訪問場所を地図アプリで確認できます。',
            // 안내문
            guide: 'ご案内', giftTitle: '記念品のご案内', giftText: '梧桐島灯台を訪問すると記念品を受け取ることができます。',
            timeTitle: '訪問時間のご案内',
            timeText: '梧桐島灯台は18時以降は訪問できません。時間をご確認のうえ、18時前にお越しください。',
            // 공지사항
            notice: 'お知らせ', important: '重要', passportPlace: '紙パスポート発行場所',
            passportPlaceText: '麗水世界島博覧会会場、梧桐島灯台、麗水沿岸旅客船ターミナル',
            passportPlaceText2: '麗水旧港灯台は周囲での写真撮影のみ可能で、内部への訪問はできません。',
            // 주의사항
            caution: '注意事項', 
            caution1: 'QRコードは公式案内場所に掲示されたものだけをご利用ください。', 
            caution2: 'ネットワーク状況によりページの接続が遅くなる場合があります。', 
            caution3: '個人情報や機密情報をオープンカカオトークに残さないでください。', 
            caution4: '運営状況により案内内容が変更される場合があります。最新のお知らせをご確認ください。', 
            caution5: '商品は1人1回のみ受け取り可能で、重複受け取りはできません。', 
            caution6: '商品は先着順で、なくなり次第終了となります。', 
            caution7: '代理受け取りや他人の代わりにスタンプを押す行為は禁止です。',
            // 하단탭
            navMain: 'メインメニュー', home: 'ホーム', navGuide: '案内', navNotice: 'お知らせ', navCaution: '注意',
            navDirections: 'アクセス', footer: '© 麗水地方海洋水産庁', backHome: '← ホームへ戻る',
            // 네비게이션
            directionsTitle: 'アクセス',
            directionsIntro: '訪問場所を選び、使用する地図アプリを押してください。アプリがインストールされていない場合はウェブ地図に接続します。',
            locationsAria: '訪問場所6か所', mapChoice: '地図アプリを選択',
            kakaoMap: 'カカオマップ', naverMap: 'NAVERマップ', googleMap: 'Googleマップ',
            // 주소
            loc1: '島博覧会メイン会場', addr1: '麗水市突山邑鎮毛地区（麗水市突山邑江南海岸路196）',
            loc2: '突山港南防波堤灯台', addr2: '全羅南道麗水市突山邑郡内里1581',
            loc3: '麗水新北港防波堤灯台', addr3: '全羅南道麗水市徳忠洞2101',
            loc4: '麗水旧港防波堤ハメル灯台', addr4: '全羅南道麗水市鍾和洞458-7',
            loc5: '麗水旧港灯台', addr5: '全羅南道麗水市校洞682-1',
            loc6: '梧桐島灯台', addr6: '全羅南道麗水市水晶洞1-7'
        },

        // 중국어
        zh: {
            documentTitle: '沿岛灯塔环游', description: '沿岛灯塔环游信息网站', homeAria: '返回首页', skip: '跳转到正文',
            tourTitle: '沿岛灯塔环游', language: '语言', fontSize: '文字大小', fontGroup: '文字大小设置',
            small: '小', normal: '中', large: '大', welcome: 'WELCOME', heroTitle: '沿岛灯塔环游信息网站',
            heroText: '请查看公告和使用指南。如有疑问、不便或投诉，请通过开放式 KakaoTalk 联系我们。',
            kakaoTitle: '打开 KakaoTalk', kakaoText: '请留下您的咨询内容。', directions: '到访路线',
            directionsText: '可通过地图应用查看6个到访地点。', 
            // 안내문
            guide: '使用指南', giftTitle: '纪念品说明',
            giftText: '到访梧桐岛灯塔后可以领取纪念品。', timeTitle: '开放时间说明',
            timeText: '梧桐岛灯塔18:00后无法到访。请确认时间并于18:00前到达。', 
            // 공지사항
            notice: '公告事项',
            important: '重要', passportPlace: '纸质护照发放地点',
            passportPlaceText: '丽水世界岛屿博览会会场、梧桐岛灯塔、丽水沿海客运码头',
            passportPlaceText2: '丽水旧港灯塔仅可在周边进行拍照，内部参观不可。',
            // 주의사항
            caution: '注意事项', 
            caution1: '请仅使用张贴在官方说明地点的二维码。',
            caution2: '根据网络状况，页面连接可能会变慢。', 
            caution3: '请勿在开放式 KakaoTalk 中留下个人或敏感信息。',
            caution4: '指南内容可能根据运营情况变更，请查看最新公告。', 
            caution5: '每人仅可领取一次奖品，不可重复领取。',
            caution6: '奖品按先到先得方式提供，发完即止。', 
            caution7: '禁止代领或替他人盖章。',
            // 하단탭
            navMain: '主菜单', home: '首页', navGuide: '指南', navNotice: '公告', navCaution: '注意',
            navDirections: '路线', footer: '© 丽水地方海洋水产厅', backHome: '← 返回首页',
            // 네비게이션
            directionsTitle: '到访路线',
            directionsIntro: '请选择到访地点，然后点击所使用的地图应用。未安装应用时将连接到网页地图。',
            locationsAria: '6个到访地点', mapChoice: '选择地图应用',
            kakaoMap: 'Kakao地图', naverMap: 'NAVER地图', googleMap: 'Google地图',
            // 주소
            loc1: '岛屿博览会主展馆', addr1: '丽水市突山邑镇毛地区（丽水市突山邑江南海岸路196）',
            loc2: '突山港南防波堤灯塔', addr2: '全罗南道丽水市突山邑郡内里1581',
            loc3: '丽水新北港防波堤灯塔', addr3: '全罗南道丽水市德忠洞2101',
            loc4: '丽水旧港防波堤哈梅尔灯塔', addr4: '全罗南道丽水市钟和洞458-7',
            loc5: '丽水旧港灯塔', addr5: '全罗南道丽水市校洞682-1',
            loc6: '梧桐岛灯塔', addr6: '全罗南道丽水市水晶洞1-7'
        }
    };

    const logoMap = {
        ko: 'assets/logo-ko.png',
        en: 'assets/logo-en.png',
        ja: 'assets/logo-ja.png',
        zh: 'assets/logo-zh.png'
    };

    const titleLogoMap = {
        ko: 'assets/title-ko.png',
        en: 'assets/title-en.png',
        ja: 'assets/title-ja.png',
        zh: 'assets/title-zh.png'
    };

    const localeMap = {
        ko: 'ko-KR',
        en: 'en-US',
        ja: 'ja-JP',
        zh: 'zh-CN'
    };

    function applyLanguage(lang) {
        const selected = translations[lang] ? lang : 'ko';
        const dict = translations[selected];
        document.documentElement.lang = selected === 'zh' ? 'zh-CN' : selected;
        document.title = dict.documentTitle;
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.content = dict.description;

        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.dataset.i18n;
            if (dict[key] !== undefined) el.textContent = dict[key];
        });

        document.querySelectorAll('[data-i18n-html]').forEach((el) => {
            const key = el.dataset.i18nHtml;
            if (dict[key] !== undefined) el.innerHTML = dict[key];
        });

        document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
            const key = el.dataset.i18nAria;
            if (dict[key] !== undefined) el.setAttribute('aria-label', dict[key]);
        });

        document.querySelectorAll('[data-i18n-title]').forEach((el) => {
            const key = el.dataset.i18nTitle;
            if (dict[key] !== undefined) el.setAttribute('title', dict[key]);
        });

        document.querySelectorAll('.brand__logo').forEach((logo) => {
            logo.src = logoMap[selected];
            logo.alt = dict.documentTitle;
        });

        document.querySelectorAll('.brand__title-logo').forEach((titleLogo) => {
            titleLogo.src = titleLogoMap[selected];
            titleLogo.alt = dict.tourTitle;
        });

        document.querySelectorAll('.language-select').forEach((select) => { select.value = selected; });
        localStorage.setItem('qrPageLanguage', selected);
        document.documentElement.style.setProperty('--lang-font', selected === 'ja' ? '"Noto Sans JP"' : selected === 'zh' ? '"Noto Sans SC"' : selected === 'en' ? 'Arial' : 'Pretendard');
        window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: selected, locale: localeMap[selected] } }));
    }

    window.QR_LANG = { applyLanguage, translations };
    document.addEventListener('DOMContentLoaded', () => {
        const saved = localStorage.getItem('qrPageLanguage');
        const browser = (navigator.language || 'ko').toLowerCase();
        const initial = saved || (browser.startsWith('ja') ? 'ja' : browser.startsWith('zh') ? 'zh' : browser.startsWith('en') ? 'en' : 'ko');
        document.querySelectorAll('.language-select').forEach((select) => select.addEventListener('change', (e) => applyLanguage(e.target.value)));
        applyLanguage(initial);
    });
})();
