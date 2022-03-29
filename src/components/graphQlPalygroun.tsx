import React, {useEffect, useState} from 'react';
import {useQuery} from '@apollo/client';
import {GET_ROOMS} from '../graphQl/query';

export const GraphQlPlayGround=()=>{
  const {data: userGql = {}} = useQuery(GET_ROOMS);
  const [user, setUser] = useState();
  useEffect(() => {
    console.log(userGql);
    if (userGql.get_user_info) {
      // console.log(budgetGql.budget);
      setUser(userGql.get_user_info.role);
    }
  }, [userGql]);

  console.log(user);

  return <div>sss</div>;
};
