import { useCallback, useEffect } from 'react'

interface Props {
  observerRef: HTMLDivElement | null
  fetchMore: () => void
  hasMore: boolean
}

// "IntersectionObserver"의 옵션들
const options: IntersectionObserverInit = {
  root: document.querySelector('.messagePrint'),
  threshold: 0.1
}

const useInfiniteScrolling = ({ observerRef, fetchMore, hasMore }: Props): void => {
  // 뷰포트 내에 감시하는 태그가 들어왔다면 패치
  const onScroll: IntersectionObserverCallback = useCallback(
    (entries, observer) => {
      if (!entries[0].isIntersecting) return

      // "redux"를 쓴다면 () => { dispatch(/* */); } 형태로 사용
      setTimeout(() => {
        fetchMore()
      }, 10000)
    },
    [fetchMore]
  )
  // observer 등록 ( 해당 태그가 뷰포트에 들어오면 게시글 추가 패치 실행 )
  useEffect(() => {
    if (!observerRef) return

    // 콜백함수와 옵션값 지정
    const observer = new IntersectionObserver(onScroll, options)
    // 특정 요소 감시 시작
    observer.observe(observerRef)

    // 더 가져올 게시글이 존재하지 않는다면 패치 중지
    if (!hasMore) observer.unobserve(observerRef)

    // 감시 종료
    return () => { observer.disconnect() }
  }, [observerRef, onScroll, hasMore])
}

export default useInfiniteScrolling
