import { type ChatRoomMember } from './ChatRoomMember'

export interface ChatRoom {
  roomUuid: string
  updateAt: string
  members: ChatRoomMember
  lastMessage: string
}

// const chatRoom: ChatRoom = {
//   uuid: '채팅방 UUID 321432-432534-543',
//   members: [
//     {
//       id: 1,
//       createdAt: Date.now(),
//       userUuid: '영민이 UUID',
//     },
//     {
//       id: 2,
//       createdAt: Date.now(),
//       userUuid: '상대방 누군가 UUID',
//     },
//   ],
// }
