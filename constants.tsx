
import { SurvivalTip, Phrase } from './types';

export const TRANSLATIONS = {
  KO: {
    scannerTitle: "AI 가격 스캐너",
    guideTitle: "야시장 팁",
    phrasesTitle: "회화 & 번역",
    startTitle: "달랏 야시장 탐험",
    startSub: "어떻게 가격을 확인할까요?",
    byCamera: "카메라로 찍기",
    bySearch: "텍스트 검색",
    searchPlaceholder: "품목을 입력하세요 (예: 아티초크 차)",
    editing: "결과가 틀린가요? 직접 입력하세요",
    priceResult: "시장 시세 정보",
    recommended: "권장 시세",
    negotiation: "바가지 피하는 팁",
    details: "상세 정보",
    reset: "다시 하기",
    identifyFailed: "인식 실패",
    priceFailed: "가격 조회 실패",
    confirmItem: "이 물건이 맞나요?",
    searchBtn: "조회하기",
    lang: "한국어",
    translatePlaceholder: "번역할 내용을 입력하세요",
    translateBtn: "번역하기",
    translating: "번역 중..."
  },
  VN: {
    scannerTitle: "Máy quét AI",
    guideTitle: "Mẹo đi chợ",
    phrasesTitle: "Dịch & Giao tiếp",
    startTitle: "Khám phá chợ Đà Lạt",
    startSub: "Bạn muốn kiểm tra giá thế nào?",
    byCamera: "Chụp ảnh",
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
    translating: "Đang dịch..."
  }
};

export const SURVIVAL_TIPS: SurvivalTip[] = [
  {
    id: '1',
    icon: 'Shirt',
    color: 'text-blue-500 bg-blue-50',
    title: { KO: '옷감 재질을 꼭 확인하세요', VN: 'Kiểm tra chất liệu vải' },
    description: { 
      KO: '저품질 중국산 옷감을 현지 수제 니트라고 속여 파는 경우가 많습니다. 반드시 직접 만져보고 바느질을 확인하세요.',
      VN: 'Nhiều người bán vải Trung Quốc kém chất lượng nhưng nói là đồ len thủ công Đà Lạt. Hãy kiểm tra kỹ bề mặt vải.'
    }
  },
  {
    id: '2',
    icon: 'ShieldAlert',
    color: 'text-red-500 bg-red-50',
    title: { KO: '귀중품은 들고가지 않기', VN: 'Không mang đồ quý giá' },
    description: { 
      KO: '야시장은 인파가 매우 많아 소매치기가 기승을 부립니다. 고가의 장신구나 여권은 숙소에 두고 오세요.',
      VN: 'Chợ đêm rất đông đúc, hãy cảnh giác móc túi. Đừng mang theo đồ trang sức đắt tiền hoặc hộ chiếu.'
    }
  },
  {
    id: '3',
    icon: 'Clock',
    color: 'text-amber-500 bg-amber-50',
    title: { KO: '22시 이후: 흥정의 황금 시간', VN: 'Sau 22h: Giờ vàng mặc cả' },
    description: { 
      KO: '상인들이 정리를 시작하는 시간입니다. 니트 의류나 기념품을 "최저가"로 쉽게 흥정할 수 있는 최고의 기회입니다.',
      VN: 'Đây là lúc người bán bắt đầu dọn hàng. Bạn có thể mua đồ len hoặc quà lưu niệm với giá rẻ nhất.'
    }
  },
  {
    id: '4',
    icon: 'Sparkles',
    color: 'text-indigo-500 bg-indigo-50',
    title: { KO: '18시-19시: 신선함과 품질', VN: '18h-19h: Đồ mới nhất' },
    description: { 
      KO: '시장이 막 열려 상품이 가장 다양하고 상태가 좋지만, 흥정은 다른 시간대에 비해 다소 어려울 수 있습니다.',
      VN: 'Hàng hóa mới nhất và đẹp nhất nhưng việc trả giá sẽ khó hơn so với các khung giờ khác.'
    }
  }
];

export const PHRASES: Phrase[] = [
  { id: 'p1', category: '흥정', ko: '얼마예요?', vn: 'Bao nhiêu tiền?', phonetic: '바오 니에우 띠엔?' },
  { id: 'p2', category: '흥정', ko: '너무 비싸요!', vn: 'Đắt quá!', phonetic: '닷 꾸아!' },
  { id: 'p3', category: '흥정', ko: '깎아주세요.', vn: 'Giảm giá đi.', phonetic: '지암 자 디.' },
  { id: 'p4', category: '주문', ko: '이거 주세요.', vn: 'Lấy cái này.', phonetic: '라이 까이 나이.' },
  { id: 'p5', category: '주문', ko: '설탕 넣지 마세요.', vn: 'Không đường.', phonetic: '콤 드엉.' },
  { id: 'p6', category: '인사', ko: '안녕하세요.', vn: 'Xin chào.', phonetic: '씬 짜오.' },
  { id: 'p7', category: '인사', ko: '감사합니다.', vn: 'Cảm ơn.', phonetic: '깜 언.' }
];
