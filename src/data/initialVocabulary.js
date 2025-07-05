// Initial vocabulary database
export const initialVocabulary = [
  {
    id: 1,
    english: 'hello',
    vietnamese: 'xin chào',
    pronunciation_us: 'həˈloʊ',
    pronunciation_uk: 'həˈləʊ',
    category: 'interjections',
    definition: 'Used as a greeting or to begin a phone conversation',
    example: 'Hello, how are you today?',
    level: 'A1',
    dateAdded: new Date('2024-01-01').toISOString()
  },
  {
    id: 2,
    english: 'beautiful',
    vietnamese: 'đẹp',
    pronunciation_us: 'ˈbjuːtɪfəl',
    pronunciation_uk: 'ˈbjuːtɪf(ə)l',
    category: 'adjectives',
    definition: 'Pleasing the senses or mind aesthetically',
    example: 'The sunset was absolutely beautiful.',
    level: 'A2',
    dateAdded: new Date('2024-01-02').toISOString()
  },
  {
    id: 3,
    english: 'opportunity',
    vietnamese: 'cơ hội',
    pronunciation_us: 'ˌɑːpərˈtuːnəti',
    pronunciation_uk: 'ˌɒpəˈtjuːnɪti',
    category: 'nouns',
    definition: 'A set of circumstances that makes it possible to do something',
    example: 'This job offers a great opportunity for career growth.',
    level: 'B1',
    dateAdded: new Date('2024-01-03').toISOString()
  },
  {
    id: 4,
    english: 'accomplish',
    vietnamese: 'hoàn thành',
    pronunciation_us: 'əˈkɑːmplɪʃ',
    pronunciation_uk: 'əˈkʌmplɪʃ',
    category: 'verbs',
    definition: 'To achieve or complete successfully',
    example: 'She was able to accomplish all her goals this year.',
    level: 'B2',
    dateAdded: new Date('2024-01-04').toISOString()
  },
  {
    id: 5,
    english: 'serendipity',
    vietnamese: 'sự tình cờ may mắn',
    pronunciation_us: 'ˌserənˈdɪpəti',
    pronunciation_uk: 'ˌserənˈdɪpɪti',
    category: 'nouns',
    definition: 'The occurrence of events by chance in a happy way',
    example: 'Meeting my future business partner at that coffee shop was pure serendipity.',
    level: 'C1',
    dateAdded: new Date('2024-01-05').toISOString()
  },
  {
    id: 6,
    english: 'perspicacious',
    vietnamese: 'sắc sảo, thông thái',
    pronunciation_us: 'ˌpɜːrspɪˈkeɪʃəs',
    pronunciation_uk: 'ˌpɜːspɪˈkeɪʃəs',
    category: 'adjectives',
    definition: 'Having a ready insight into and understanding of things',
    example: 'Her perspicacious analysis of the market trends impressed the board.',
    level: 'C2',
    dateAdded: new Date('2024-01-06').toISOString()
  },
  {
    id: 7,
    english: 'quickly',
    vietnamese: 'nhanh chóng',
    pronunciation_us: 'ˈkwɪkli',
    pronunciation_uk: 'ˈkwɪkli',
    category: 'adverbs',
    definition: 'At a fast speed; rapidly',
    example: 'She quickly finished her homework before dinner.',
    level: 'A2',
    dateAdded: new Date('2024-01-07').toISOString()
  },
  {
    id: 8,
    english: 'run',
    vietnamese: 'chạy',
    pronunciation_us: 'rʌn',
    pronunciation_uk: 'rʌn',
    category: 'verbs',
    definition: 'Move at a speed faster than a walk',
    example: 'I run every morning to stay healthy.',
    level: 'A1',
    dateAdded: new Date('2024-01-08').toISOString()
  },
  {
    id: 9,
    english: 'break the ice',
    vietnamese: 'phá vỡ sự ngại ngùng',
    pronunciation_us: 'breɪk ði aɪs',
    pronunciation_uk: 'breɪk ði aɪs',
    category: 'idioms',
    definition: 'To make people feel more relaxed in a social situation',
    example: 'He told a joke to break the ice at the meeting.',
    level: 'B2',
    dateAdded: new Date('2024-01-09').toISOString()
  },
  {
    id: 10,
    english: 'in spite of',
    vietnamese: 'mặc dù',
    pronunciation_us: 'ɪn spaɪt ʌv',
    pronunciation_uk: 'ɪn spaɪt ʌv',
    category: 'prepositions',
    definition: 'Despite; without being affected by',
    example: 'In spite of the rain, we continued our hike.',
    level: 'B1',
    dateAdded: new Date('2024-01-10').toISOString()
  },
  {
    id: 11,
    english: 'make a decision',
    vietnamese: 'đưa ra quyết định',
    pronunciation_us: 'meɪk ə dɪˈsɪʒən',
    pronunciation_uk: 'meɪk ə dɪˈsɪʒən',
    category: 'collocations',
    definition: 'To choose what to do after considering options',
    example: 'I need to make a decision about my career.',
    level: 'B1',
    dateAdded: new Date('2024-01-11').toISOString()
  },
  {
    id: 12,
    english: 'artificial intelligence',
    vietnamese: 'trí tuệ nhân tạo',
    pronunciation_us: 'ˌɑːrtɪˈfɪʃəl ɪnˈtelɪdʒəns',
    pronunciation_uk: 'ˌɑːtɪˈfɪʃəl ɪnˈtelɪdʒəns',
    category: 'technology',
    definition: 'Computer systems able to perform tasks normally requiring human intelligence',
    example: 'Artificial intelligence is transforming many industries.',
    level: 'C1',
    dateAdded: new Date('2024-01-12').toISOString()
  }
];

export const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const categories = [
  { id: 'nouns', name: 'Danh từ', icon: '📝', description: 'Từ chỉ người, vật, hiện tượng' },
  { id: 'verbs', name: 'Động từ', icon: '🏃', description: 'Từ chỉ hành động, trạng thái' },
  { id: 'adjectives', name: 'Tính từ', icon: '🎨', description: 'Từ chỉ tính chất, đặc điểm' },
  { id: 'adverbs', name: 'Trạng từ', icon: '⚡', description: 'Từ bổ nghĩa cho động từ, tính từ' },
  { id: 'prepositions', name: 'Giới từ', icon: '🔗', description: 'Từ chỉ mối quan hệ vị trí, thời gian' },
  { id: 'conjunctions', name: 'Liên từ', icon: '🤝', description: 'Từ nối các từ, cụm từ, câu' },
  { id: 'pronouns', name: 'Đại từ', icon: '👤', description: 'Từ thay thế cho danh từ' },
  { id: 'interjections', name: 'Thán từ', icon: '💬', description: 'Từ thể hiện cảm xúc' },
  { id: 'phrases', name: 'Cụm từ', icon: '📱', description: 'Tổ hợp nhiều từ có nghĩa riêng' },
  { id: 'idioms', name: 'Thành ngữ', icon: '🎭', description: 'Cách nói có nghĩa bóng' },
  { id: 'collocations', name: 'Từ đi với nhau', icon: '🔄', description: 'Những từ thường xuất hiện cùng nhau' },
  { id: 'business', name: 'Kinh doanh', icon: '💼', description: 'Từ vựng chuyên ngành kinh doanh' },
  { id: 'technology', name: 'Công nghệ', icon: '💻', description: 'Từ vựng về công nghệ thông tin' },
  { id: 'travel', name: 'Du lịch', icon: '✈️', description: 'Từ vựng về du lịch, giao thông' },
  { id: 'food', name: 'Ẩm thực', icon: '🍕', description: 'Từ vựng về đồ ăn, thức uống' },
  { id: 'academic', name: 'Học thuật', icon: '🎓', description: 'Từ vựng học thuật, chính thức' }
];

export const levelLabels = {
  A1: 'A1 - Khởi đầu',
  A2: 'A2 - Cơ bản', 
  B1: 'B1 - Trung cấp thấp',
  B2: 'B2 - Trung cấp cao',
  C1: 'C1 - Cao cấp',
  C2: 'C2 - Thành thạo',
  // Backward compatibility
  beginner: 'A1-A2 - Cơ bản',
  intermediate: 'B1-B2 - Trung cấp',
  advanced: 'C1-C2 - Nâng cao'
};
