export interface Chat {
  uuid: string
  createdAt: number
  userUuid: string
  message: string
}

// let isFocus: boolean = false
//
// window.addEventListener('focus', () => {
//   // 웹 페이지 포커스 됐을 때
//   isFocus = true
// })
//
// window.addEventListener('blur', () => {
//   // 웹 페이지 포커스가 벗어버렷
//   isFocus = false
// })

// async (chat: Chat) => {
//   // 채팅이 왔을 때
//   if (!isFocus) {
//
//   }

// 채당 채팅을 읽었다고 처리하기
// const res = await api.put('/v1/chat/${chat.uuid}/read');
// if (res.status === 200) {
//   // 읽음으로 처리 완료
//   this.setState({});
// }
// }

// const chat: Chat = {
//   uuid: 'dsadasd-dsadsa-dsa----dsad',
//   createdAt: Date.now(),
//   message: '테스트 메세지'
// }

// if (chat.userUuid === userStore.user.uuid) {
// 내가 보낸 메세지
// return (
// )
// } else {
// 상대방이 보낸 메세지
// return (
// )
// }
