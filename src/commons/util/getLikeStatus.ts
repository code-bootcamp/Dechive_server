import { IBoardsServiceGetLikeStatus } from 'src/apis/boards/interfaces/board-service.interface';

export const getLikeStatus = ({
  boards,
  userid,
}: IBoardsServiceGetLikeStatus) => {
  boards.forEach((el) => {
    if (el.likers.length) {
      el.likers.forEach((e) => {
        if (userid === e.id) {
          el['like'] = true;
        }
      });
    }
  });
  return boards;
};
