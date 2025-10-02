import { supabase } from './supabase';

export const fetchEvents = async () => {
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      societies (
        name,
        image
      )
    `);

  if (error) throw new Error(error.message);

  return data;
}

export const fetchAvatar = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  const { data, error } = await supabase
    .from("profiles")
    .select("avatar")
    .eq('id', userId)
    .single();

  if (error) throw new Error(error.message);

  return data.avatar;
}

export const fetchSocieties = async () => {
  const { data, error } = await supabase
    .from("societies")
    .select("*");

  if (error) throw new Error(error.message);

  console.log(data);

  return data;
}

export const fetchFavourites = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  if (!userId) {
    return { favourite_societies: [] };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("favourite_societies")
    .eq('id', userId)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export const updateFavourites = async (favourites) => {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  const { error } = await supabase
    .from("profiles")
    .update({ favourite_societies: favourites })
    .eq('id', userId);

  if (error) throw new Error(error.message);
}

export const fetchNetwork = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  const { data, error } = await supabase
    .from("network_interests")
    .select("event_id")
    .eq('user_id', userId);

  if (error) throw new Error(error.message);

  return { user, fetchedNetwork: data };
}

export const fetchEventNetwork = async (eventId) => {
  const { data, error } = await supabase
    .from("network_interests")
    .select("user_id")
    .eq('event_id', eventId);

  if (error) throw new Error(error.message);

  return data;
}

export const fetchEventUsers = async (eventId) => {
  const { data: interestData, error: interestError } = await supabase
    .from('network_interests')
    .select('user_id')
    .eq('event_id', eventId);

  if (interestError) throw new Error(interestError.message);

  const userIds = interestData.map(item => item.user_id);
  if (userIds.length === 0) return [];

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .in('id', userIds);

  if (error) throw new Error(error.message);

  return data;
};

export const deleteNetwork = async (eventId) => {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  const { error } = await supabase
    .from('network_interests')
    .delete()
    .eq('user_id', userId)
    .eq('event_id', eventId);

  if (error) throw new Error(error.message);
}

export const updateNetwork = async (eventId) => {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  const { error } = await supabase
  .from('network_interests')
  .upsert({ user_id: userId, event_id: eventId }, {
    onConflict: ['user_id', 'event_id']
  });

  if (error) throw new Error(error.message);
}

export const updateHint = async (eventId, hint) => {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  const { error } = await supabase
  .from('network_interests')
  .upsert({ user_id: userId, event_id: eventId, hint: hint }, {
    onConflict: ['user_id', 'event_id']
  });

  if (error) throw new Error(error.message);
}

export const uploadImage = async ({ e }) => {
  const file = e.target.files[0];
  if (!file) {
    return;
  }

  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    throw new Error("Only JPEG or PNG files are allowed.");
  }

  if (file.size > 3 * 1024 * 1024) {
    throw new Error("File exceeds 3 MB limit.");
  }

  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(`${userId}_${file.name}`, file, { upsert: true });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(`${userId}_${file.name}`);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar: data.publicUrl })
    .eq('id', userId);

  if (updateError) throw new Error(updateError.message);

  return data.publicUrl;
}

export const getOrCreateUserGroup = async (eventId) => {
  const { data: existingGroups, error: groupCheckError } = await supabase
    .from('event_groups')
    .select('id')
    .eq('event_id', eventId);

  if (groupCheckError) throw new Error(groupCheckError.message);

  if (!existingGroups || existingGroups.length === 0) {
    const { data: users, error: usersError } = await supabase
      .from('network_interests')
      .select('user_id')
      .eq('event_id', eventId);

    console.log(users);

    if (usersError) throw new Error(usersError.message);
    if (!users || users.length === 0) return [];

    const groupSize = 3;
    const groupNum = Math.ceil(users.length / groupSize);

    const groupIds = [];
    for (let i = 0; i < groupNum; i++) {
      const { data: newGroup, error: newGroupError } = await supabase
        .from('event_groups')
        .insert({ event_id: eventId })
        .select('id')
        .single();

      console.log(newGroup);
      if (newGroupError) throw new Error(newGroupError.message);
      groupIds.push(newGroup.id);
    }

    let groupIndex = 0;
    for (let i = 0; i < users.length; i += groupSize) {
      const chunk = users.slice(i, i + groupSize);
      const inserts = chunk.map(u => ({
        group_id: groupIds[groupIndex],
        user_id: u.user_id,
      }));

      console.log(inserts);

      const { error: insertError } = await supabase
        .from('group_users')
        .insert(inserts);

      if (insertError) throw new Error(insertError.message);
      groupIndex++;
    }
  }

  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
  const username = user.user_metadata?.username;
  if (!userId) return [];

  const { data: myGroups, error: myGroupError } = await supabase
    .from('group_users')
    .select('group_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (myGroupError) throw new Error(myGroupError.message);
  if (!myGroups || myGroups.length === 0) return [];

  const groupId = myGroups[0].group_id;

  const { data: groupUsers, error: groupUsersError } = await supabase
    .from('group_users')
    .select(`
      user_id,
      has_arrived,
      profiles(avatar)
    `)
    .eq('group_id', groupId);

  console.log(groupUsers);

  if (groupUsersError) throw new Error(groupUsersError.message);

  return { data: groupUsers, username };
};

export const toggleArrival = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
  if (!userId) return;

  const { data: myGroups, error: myGroupError } = await supabase
    .from('group_users')
    .select('group_id', 'has_arrived')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (myGroupError) throw new Error(myGroupError.message);
  if (!myGroups || myGroups.length === 0) return [];

  const { group_id, has_arrived } = myGroups[0];

  const { error: updateError } = await supabase
    .from('group_users')
    .update({ has_arrived: !has_arrived, arrived_at: !has_arrived ? new Date() : null })
    .eq('group_id', group_id)
    .eq('user_id', userId);

  if (updateError) throw new Error(updateError.message);
};


