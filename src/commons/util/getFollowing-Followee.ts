import { User } from 'src/apis/users/entities/user.entity';

export const getFollowingByFollowees = ({ guest, user }): User[] => {
  const followeeid = guest.followees.map((el) => el.followeeid);
  const followingid = guest.followings.map((el) => el.followingid);

  user.forEach((el) => {
    el['followeesCount'] = el.followees.length;
    el['followingsCount'] = el.followings.length;

    el['followeeStatus'] = followeeid.includes(el.id) ?? false;
    el['followingStatus'] = followingid.includes(el.id) ?? false;
  });
  return user;
};
