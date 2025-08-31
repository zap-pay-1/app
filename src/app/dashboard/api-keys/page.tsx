
import { SERVER_EDNPOINT_URL } from '@/lib/constants';
import React from 'react'
import {auth} from "@clerk/nextjs/server"
import { USER, USER_DATA } from '@/types/types';
import ApiKeys from '@/components/pages/api-keys-page';
export default async function page() {
    const { userId } = await auth()
     const res = await fetch(`${SERVER_EDNPOINT_URL}users/${userId}`, {
        // next: { revalidate: 120 },
        cache: 'no-store',
      });
      const user : USER_DATA = await res.json();
     console.log(user)
  return (
    <div>
  <ApiKeys data={user} />
    </div>
  )
}