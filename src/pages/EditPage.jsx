import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// ===============================================
// TagInput & MarkdownPreviewer 그대로 재사용
// ===============================================
// Firebase/Auth 관련 Mockup Data 및 함수 (필수 요소이므로 포함)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};

// ===============================================
// CSS Variables & Global Styles (Tailwind 대체)
// ===============================================
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  

  /* Basic reset for elements */
  h1, h2, h3, h4, h5, h6, p, ul, ol, li, blockquote, pre, code, table {
    margin: 0;
    padding: 0;
  }

  /* Prose-like styling for markdown content */
  .markdown-preview-content h1 {
    font-size: 2.5em; /* 40px */
    font-weight: 800;
    margin-top: 1.5em;
    margin-bottom: 0.8em;
    border-bottom: 1px solid #e2e8f0; /* gray-200 */
    padding-bottom: 0.3em;
  }
  .markdown-preview-content h2 {
    font-size: 2em; /* 32px */
    font-weight: 700;
    margin-top: 1.2em;
    margin-bottom: 0.7em;
  }
  .markdown-preview-content h3 {
    font-size: 1.5em; /* 24px */
    font-weight: 600;
    margin-top: 1em;
    margin-bottom: 0.6em;
  }
  .markdown-preview-content p {
    font-size: 1em; /* 16px */
    line-height: 1.75;
    margin-bottom: 1em;
  }
  .markdown-preview-content strong {
    font-weight: 700;
  }
  .markdown-preview-content em {
    font-style: italic;
  }
  .markdown-preview-content del {
    text-decoration: line-through;
  }
  .markdown-preview-content ul, .markdown-preview-content ol {
    margin-left: 1.5em;
    margin-bottom: 1em;
  }
  .markdown-preview-content ul li {
    list-style-type: disc;
    margin-bottom: 0.5em;
  }
  .markdown-preview-content ol li {
    list-style-type: decimal;
    margin-bottom: 0.5em;
  }
    
  .markdown-preview-content blockquote {
    border-left: 4px solid #01e52bff; /* indigo-500 */
    padding-left: 1em;
    margin-left: 0;
    margin-bottom: 1em;
    font-style: italic;
    color: #000000;
    background-color: #317156ff; /* indigo-50 */
  }
  .markdown-preview-content code {
    background-color: #344737ff; /* gray-100 */
    color: #e53e3e; /* red-600 */
    padding: 0.2em 0.4em;
    border-radius: 0.3em;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    font-size: 0.875em;
  }
  .markdown-preview-content pre {
    background-color: #2d3748; /* gray-800 */
    color: #e2e8f0; /* gray-200 */
    padding: 1em;
    border-radius: 0.5em;
    overflow-x: auto;
    margin-bottom: 1em;
  }
  .markdown-preview-content pre code {
    background-color: transparent;
    color: inherit;
    padding: 0;
    font-size: 1em;
  }
  .markdown-preview-content a {
    color: #667eea; /* indigo-500 */
    text-decoration: underline;
  }
  .markdown-preview-content hr {
    border: none;
    border-top: 1px solid #e2e8f0; /* gray-200 */
    margin: 2em 0;
  }
  .markdown-preview-content table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1em;
  }
  .markdown-preview-content th, .markdown-preview-content td {
    border: 1px solid #e2e8f0; /* gray-200 */
    padding: 0.8em;
    text-align: left;
  }
  .markdown-preview-content th {
    background-color: #f7fafc; /* gray-100 */
    font-weight: 600;
  }
    .markdown-preview-content h1,
.markdown-preview-content h2,
.markdown-preview-content h3,
.markdown-preview-content p,
.markdown-preview-content strong,
.markdown-preview-content em,
.markdown-preview-content del,
.markdown-preview-content ul,
.markdown-preview-content ol,
.markdown-preview-content code,
.markdown-preview-content table th,
.markdown-preview-content table td {
    color: #ffffff; /* 모두 흰색으로 통일 */
}


  /* 반응형 처리를 위한 CSS Media Query (WriteForm의 분할 영역에 적용) */
  @media (min-width: 768px) {
    .split-area {
      flex-direction: row !important;
    }
  }
`;

// ===============================================
// 1. TagInput Component
// ===============================================

const TagInput = ({ tags, setTags }) => {
    const [inputValue, setInputValue] = useState('');
    const [isComposing, setIsComposing] = useState(false); // 한글 입력 중 여부

    const handleKeyDown = (e) => {
        if (isComposing) return; // 한글 입력 중이면 무시

        if (e.key === 'Enter' && inputValue.trim() !== '') {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (!tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setInputValue('');
        } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
            setTags(tags.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            padding: '0.5rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        }}>
            {tags.map((tag, index) => (
                <span
                    key={index}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#36976eff',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        padding: '0.25rem 0.75rem',
                        marginRight: '0.5rem',
                        marginBottom: '0.25rem',
                        marginTop: '0.25rem',
                        borderRadius: '9999px',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease-in-out'
                    }}
                    onClick={() => removeTag(tag)}
                >
                    {tag}
                    <span style={{ marginLeft: '0.25rem', fontWeight: 'bold' }}>x</span>
                </span>
            ))}
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onCompositionStart={() => setIsComposing(true)} // 한글 입력 시작
                onCompositionEnd={() => setIsComposing(false)}  // 한글 입력 종료
                placeholder="태그 입력 후 Enter (예: React, JS, 개발)"
                style={{
                    width: '600px',
                    flexGrow: 0,
                    padding: '0.25rem',
                    outline: 'none',
                    color: '#1a202c',
                    backgroundColor: '#ffffff',
                    minWidth: '150px',
                    border: 'none'
                }}
            />
        </div>
    );
};


// ===============================================
// 2. MarkdownPreviewer Component (Renderer)
// marked.js를 사용해 마크다운을 HTML로 변환합니다.
// ===============================================

const MarkdownPreviewer = ({ content }) => {
    // marked.js가 window 객체에 로드되었는지 확인하고 마크다운을 HTML로 변환하는 함수
    const getParsedHtml = useCallback(() => {
        // window.marked 객체가 유효한지 확인합니다.
        if (typeof window.marked !== 'undefined' && typeof window.marked.parse === 'function') {
            window.marked.setOptions({
                gfm: true,
                breaks: true,
            });
            return window.marked.parse(content || "");
        }
        // marked.js가 로드되지 않았거나 사용할 수 없을 경우 대체 텍스트를 반환합니다.
        return "Marked.js 라이브러리를 로드 중입니다. 잠시만 기다려주세요...";
    }, [content]);

    return (
        <div
            className="markdown-preview-content" // Custom class for prose-like styling
            style={{
                color: '#ffffffff',
                width: '750px', height: '100%', overflowY: 'auto', padding: '1.5rem',
                backgroundColor: '#000000ff',
                border: '1px solid #e2e8f0', borderRadius: '0.5rem',
                boxShadow: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)', transition: 'all 0.15s ease-in-out'
            }}
            dangerouslySetInnerHTML={{ __html: getParsedHtml() }}
        />
    );
};
// ===============================================
// EditForm Component
// ===============================================
const EditForm = ({ title, setTitle, tags, setTags, content, setContent, onCancel, onSubmit }) => {
    const handleContentChange = (e) => setContent(e.target.value);

    return (
        <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '0.75rem', border: '1px solid #f7fafc', width: '100%', paddingLeft: '94px' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1a202c', marginBottom: '2rem' }}>글 수정</h1>

            {/* 제목 */}
            <input
                type="text"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                    width: '100%',
                    fontSize: '1.875rem',
                    fontWeight: 'bold',
                    padding: '0.75rem',
                    marginBottom: '1.5rem',
                    borderBottom: '2px solid #e2e8f0',
                    outline: 'none',
                    borderRadius: '0.25rem',
                    color: '#1a202c',
                    backgroundColor: '#ffffff',
                }}
                onFocus={(e) => e.target.style.borderBottomColor = '#667eea'}
                onBlur={(e) => e.target.style.borderBottomColor = '#e2e8f0'}
            />

            {/* 태그 */}
            <div style={{ marginBottom: '2rem' }}>
                <TagInput tags={tags} setTags={setTags} />
            </div>

            {/* 마크다운 입력 + 미리보기 */}
            <div
                className="split-area"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    height: '70vh',
                    minHeight: '500px'
                }}
            >
                {/* 왼쪽: 기존 글 내용 */}
                <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4a5568', marginBottom: '0.5rem' }}>마크다운 입력</label>
                    <textarea
                        placeholder="글 내용을 마크다운으로 작성하세요"
                        value={content}
                        onChange={handleContentChange}
                        style={{
                            flex: '1',
                            width: '750px',
                            padding: '1rem',
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.5rem',
                            resize: 'none',
                            outline: 'none',
                            fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
                            fontSize: '0.875rem',
                            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
                            overflowY: 'auto',
                            minHeight: '250px',
                            lineHeight: '1.6',
                            color: '#ffffffff',
                            backgroundColor: '#000000ff',
                        }}
                        onFocus={(e) => { e.target.style.borderColor = '#667eea'; e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.3)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = '0 1px 2px 0 rgba(0,0,0,0.05)'; }}
                    />
                </div>

                {/* 오른쪽: 미리보기 */}
                <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4a5568', marginBottom: '0.5rem' }}>미리보기</label>
                    <MarkdownPreviewer content={content} />
                </div>
            </div>

            {/* 버튼 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', spaceX: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingRight: '3rem' }}>
                <button
                    onClick={onCancel}
                    style={{ padding: '0.5rem 1.5rem', fontSize: '1.125rem', fontWeight: '500', color: '#4a5568', backgroundColor: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', cursor: 'pointer', marginRight: '1rem' }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#edf2f7'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#f7fafc'}
                >
                    취소
                </button>
                <button
                    onClick={onSubmit}
                    style={{ padding: '0.5rem 1.5rem', fontSize: '1.125rem', fontWeight: '500', color: '#ffffff', backgroundColor: '#40cc92ff', borderRadius: '0.75rem', cursor: 'pointer', opacity: (!title || !content) ? '0.6' : '1' }}
                    disabled={!title || !content}
                >
                    수정 완료
                </button>
            </div>
        </div>
    );
};

// ===============================================
// EditPage Component
// ===============================================
export default function EditPage() {
    const { keyword } = useParams(); // URL에서 글 식별자
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [tags, setTags] = useState([]);
    const [content, setContent] = useState('');
    const [markedLoaded, setMarkedLoaded] = useState(false);

    // marked.js 동적 로드
    useEffect(() => {
        const scriptUrl = 'https://cdn.jsdelivr.net/npm/marked@4.0.0/marked.min.js';
        const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = scriptUrl;
            script.onload = () => setMarkedLoaded(true);
            script.onerror = () => setMarkedLoaded(true);
            document.head.appendChild(script);
        } else setMarkedLoaded(true);
    }, []);

    // 기존 글 데이터 로드
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const userToken = localStorage.getItem('authToken');
                const res = await fetch(`http://127.0.0.1:8080/api/mima.wiki/w/${keyword}`, {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });

                if (res.ok) {
                    const result = await res.json();
                    const post = result.data; // 핵심: data 안에 글 내용이 들어있음
                    setTitle(post.keyword || '');
                    setContent(post.markdown || '');
                    setTags(post.tags || []);
                    console.log("초기 태그 값:", post.tags);
                } else {
                    console.error('Failed to fetch post', res.status);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchPost();
    }, [keyword]);


    const handleNavigateToMain = () => navigate('/main');

    const handleSubmit = async () => {
        const userToken = localStorage.getItem('authToken');
        if (!window.marked || typeof window.marked.parse !== 'function') return;

        const htmlContent = window.marked.parse(content || "");
        const requestBody = { keyword: title, markdown: content, content: htmlContent };

        try {
            const res = await fetch(`http://127.0.0.1:8080/api/mima.wiki/w/${keyword}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify(requestBody),
            });
            if (res.ok) {
                alert('글 수정 완료');
                navigate('/myPage');
            } else {
                const errorText = await res.text();
                alert(`수정 실패: ${res.status} - ${errorText.substring(0, 100)}...`);
            }
        } catch (err) {
            console.error(err);
            alert('네트워크 오류 발생');
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '3rem 0', fontFamily: 'Inter, sans-serif', width: '100%' }}>
            <style>{globalStyles}</style>

            <div style={{ width: '100%', maxWidth: '2000px', padding: '0 1rem' }}>
                {!markedLoaded ? (
                    <div style={{ textAlign: 'center', padding: '5rem', fontSize: '1.5rem', color: '#4a5568' }}>
                        마크다운 에디터를 로드 중입니다...
                    </div>
                ) : (
                    <EditForm
                        title={title}
                        setTitle={setTitle}
                        tags={tags}
                        setTags={setTags}
                        content={content}
                        setContent={setContent}
                        onCancel={handleNavigateToMain}
                        onSubmit={handleSubmit}
                    />
                )}
            </div>
        </div>
    );
}
