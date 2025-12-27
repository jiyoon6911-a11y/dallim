
import { SurvivalTip, Phrase } from './types';

export const TRANSLATIONS = {
  KO: {
    scannerTitle: "달랏 야시장 AI 가격 스캐너",
    guideTitle: "달니마 팁",
    phrasesTitle: "달니마 톡",
    startTitle: "달니마",
    startSub: "어떻게 가격을 확인할까요?",
    byCamera: "카메라로 스캔",
    bySearch: "텍스트로 검색",
    searchPlaceholder: "품목을 입력하세요 (예: 아티초크 차)",
    editing: "결과가 틀린가요? 직접 입력하세요",
    priceResult: "달니마 시세 정보",
    recommended: "권장 시세",
    negotiation: "바가지 피하는 팁",
    details: "상세 정보",
    reset: "다시 하기",
    identifyFailed: "인식 실패",
    priceFailed: "가격 조회 실패",
    confirmItem: "이 물건이 맞나요?",
    searchBtn: "시세 조회하기",
    lang: "한국어",
    translatePlaceholder: "번역할 내용을 입력하세요",
    translateBtn: "번역하기",
    translating: "번역 중...",
    marketTipsTitle: "현지인 시장 팁",
    mapTitle: "실시간 마켓 지도",
    zonesTitle: "야시장 구역별 안내",
    loadingMap: "주변 정보를 불러오는 중...",
    // 추가 번역
    survivalLabel: "서바이벌 가이드",
    mapSub: "구글 지도 정보를 실시간으로 조회하여 연결합니다.",
    weatherTipLabel: "여행 꿀팁",
    weatherTipTitle: "밤에는 생각보다 춥습니다!",
    weatherTipDesc: "달랏 야시장은 해발 고도가 높아 밤에는 찬바람이 많이 붑니다. 가디건이나 얇은 패딩을 꼭 챙기세요. 시장에서 파는 니트를 바로 사서 입는 것도 추천합니다!",
    smartTranslate: "스마트 번역",
    essentialTalk: "필수 야시장 회화",
    pronounceGuide: "발음 가이드",
    pronounceDesc: "베트남어는 성조가 중요하지만, 안내된 한글 발음대로 크고 명확하게 말씀하시면 현지 상인들이 대부분 이해할 수 있습니다.",
    transResult: "베트남어 번역 결과",
    readKorean: "한국어 읽기",
    pronounceInfo: "발음 안내",
    analyzing: "물건 분석 중...",
    searchingPrice: "최적가 검색 중...",
    loadingIdentify: ["이미지 실시간 분석 중...", "달랏 특산품 데이터 매칭 중...", "사물 형태 파악 완료!"],
    loadingSearch: ["실시간 시세 검색 중...", "현지 데이터 대조 중...", "합리적인 흥정 가격 산출 중..."],
    retake: "재촬영",
    krwConvert: "한화 환산 금액",
    about: "약",
    cameraReady: "카메라 준비 중...",
    tapToScan: "탭하여 스캔",
    aiScanner: "AI 스캐너"
  },
  VN: {
    scannerTitle: "Máy quét giá AI Chợ Đà Lạt",
    guideTitle: "Mẹo Dal Ni Ma",
    phrasesTitle: "Dal Ni Ma Talk",
    startTitle: "Dal Ni Ma",
    startSub: "Bạn muốn kiểm tra giá thế nào?",
    byCamera: "Quét bằng Camera",
    bySearch: "Tìm bằng chữ",
    searchPlaceholder: "Nhập tên món (VD: Trà Atiso)",
    editing: "Kết quả sai? Hãy tự nhập",
    priceResult: "Thông tin giá thị trường",
    recommended: "Giá đề xuất",
    negotiation: "Mẹo tránh bị 'chặt chém'",
    details: "Chi tiết",
    reset: "Làm lại",
    identifyFailed: "Lỗi nhận diện",
    priceFailed: "Lỗi tìm giá",
    confirmItem: "Đúng món này không?",
    searchBtn: "Kiểm tra giá",
    lang: "Tiếng Việt",
    translatePlaceholder: "Nhập nội dung cần dịch",
    translateBtn: "Dịch",
    translating: "Đang dịch...",
    marketTipsTitle: "Mẹo hay từ người bản địa",
    mapTitle: "Bản đồ thị trường trực tiếp",
    zonesTitle: "Hướng dẫn khu vực chợ",
    loadingMap: "Đang tải thông tin địa điểm...",
    // 추가 번역 (VN)
    survivalLabel: "CẨM NANG SINH TỒN",
    mapSub: "Thông tin được kết nối trực tiếp từ Google Maps.",
    weatherTipLabel: "MẸO DU LỊCH",
    weatherTipTitle: "Đêm Đà Lạt lạnh hơn bạn tưởng!",
    weatherTipDesc: "Đà Lạt nằm ở độ cao 1.500m nên đêm xuống rất lạnh. Hãy nhớ mang theo áo khoác hoặc mua ngay một chiếc áo len tại chợ nhé!",
    smartTranslate: "DỊCH THÔNG MINH",
    essentialTalk: "HỘI THOẠI CẦN THIẾT",
    pronounceGuide: "HƯỚNG DẪN PHÁT ÂM",
    pronounceDesc: "Tiếng Việt có dấu rất quan trọng, nhưng nếu bạn nói to và rõ ràng, người bán hàng vẫn sẽ hiểu được ý của bạn.",
    transResult: "KẾT QUẢ DỊCH",
    readKorean: "CÁCH ĐỌC TIẾNG HÀN",
    pronounceInfo: "HƯỚNG DẪN ĐỌC",
    analyzing: "Đang phân tích...",
    searchingPrice: "Đang tìm giá tốt nhất...",
    loadingIdentify: ["Đang phân tích hình ảnh...", "Khớp dữ liệu đặc sản Đà Lạt...", "Đã nhận diện xong!"],
    loadingSearch: ["Đang tìm giá thực tế...", "Đối chiếu dữ liệu địa phương...", "Đang tính giá mặc cả hợp lý..."],
    retake: "Chụp lại",
    krwConvert: "Giá tương đương tiền Hàn (KRW)",
    about: "Khoảng",
    cameraReady: "Đang chuẩn bị camera...",
    tapToScan: "Chạm để quét",
    aiScanner: "Máy quét AI"
  }
};

export const SURVIVAL_TIPS: SurvivalTip[] = [
  {
    id: 'prep',
    icon: 'Wallet',
    color: 'text-emerald-600 bg-emerald-50',
    title: { KO: '1. 방문 전 준비사항', VN: '1. Chuẩn bị trước khi đi' },
    description: { 
      KO: '충분한 현금(VND)을 잔돈 위주로 준비하세요. 10월~3월은 밤 기온이 매우 낮으니 따뜻한 외투가 필수입니다.',
      VN: 'Chuẩn bị đủ tiền mặt (VND), ưu tiên tiền lẻ. Đêm Đà Lạt từ tháng 10-3 rất lạnh, hãy mang áo khoác ấm.'
    }
  },
  {
    id: 'safety',
    icon: 'ShieldAlert',
    color: 'text-red-500 bg-red-50',
    title: { KO: '2. 개인 소지품 안전 관리', VN: '2. Quản lý đồ cá nhân' },
    description: { 
      KO: '사람이 많으므로 소매치기를 주의하세요. 지갑, 휴대폰은 항상 주의하여 보관하고 가방은 앞으로 매는 것이 좋습니다.',
      VN: 'Chợ rất đông, hãy cẩn thận móc túi. Luôn để mắt tới ví and điện thoại, nên đeo túi phía trước.'
    }
  },
  {
    id: 'food',
    icon: 'Utensils',
    color: 'text-orange-500 bg-orange-50',
    title: { KO: '3. 야시장 음식 이용 시', VN: '3. Khi ăn uống tại chợ' },
    description: { 
      KO: '주문 전 반드시 가격을 확인하세요. 즉석에서 고온 조리하는 음식이 위생상 안전합니다.',
      VN: 'Nhất định phải hỏi giá trước khi đặt! Chọn các món được nấu chín nóng hổi.'
    }
  }
];

export const PHRASES: Phrase[] = [
  { id: 'p6', category: '인사', ko: '안녕하세요.', vn: 'Xin chào.', phonetic: '씬 짜오.' },
  { id: 'p7', category: '인사', ko: '감사합니다.', vn: 'Cảm ơn.', phonetic: '깜 언.' },
  { id: 'p4', category: '주문', ko: '이거 주세요.', vn: 'Lấy cái này.', phonetic: '라이 까이 나이.' },
  { id: 'p1', category: '흥정', ko: '얼마예요?', vn: 'Bao nhiêu tiền?', phonetic: '바오 니에우 띠엔?' },
  { id: 'p2', category: '흥정', ko: '너무 비싸요!', vn: 'Đắt quá!', phonetic: '닷 꾸아!' },
  { id: 'p3', category: '흥정', ko: '깎아주세요.', vn: 'Giảm giá đi.', phonetic: '지암 자 디.' },
  { id: 'p5', category: '주문', ko: '고수 넣지 마세요.', vn: 'Không cho rau mùi.', phonetic: '콤 쪼 라우 무이.' },
  { id: 'p_no', category: '흥정', ko: '안 사요.', vn: 'Không mua.', phonetic: '콤 무아.' }
];
