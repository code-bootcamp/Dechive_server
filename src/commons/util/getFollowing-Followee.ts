import { User } from 'src/apis/users/entities/user.entity';

interface getFollowingByFollowees {
  guest: User;
  user: User[];
}

export const getFollowingByFollowees = ({
  guest,
  user,
}: getFollowingByFollowees): User[] => {
  const followeeid = guest.followees.map((el) => el.followeeid);
  const followingid = guest.followings.map((el) => el.followingid);

  user.forEach((el) => {
    el['followeesCount'] = el.followees.length;
    el['followingsCount'] = el.followings.length;

    el['followeeStatus'] = followeeid.includes(el.id) ?? false;
    el['followingStatus'] = followingid.includes(el.id) ?? false;
  });
  user.sort((a, b) =>
    a.followingStatus === b.followingStatus ? 0 : a.followingStatus ? -1 : 1,
  );

  return user;
};
