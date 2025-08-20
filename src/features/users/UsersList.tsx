import React, { useEffect, useState } from 'react';
import { getUsers, type User, type UsersResponse } from '../../api/usersApi';
import styles from "./UsersList.module.scss";

export default function UsersList() {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleRegistered = () => {
      setUsers([]);
      setPage(1);
      loadUsers(1);
    };

    window.addEventListener('user:registered', handleRegistered);
    return () => window.removeEventListener('user:registered', handleRegistered);
  }, []);

    const loadUsers = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const data: UsersResponse = await getUsers(pageNumber, 6);

            const sortedUsers = [...data.users].sort(
                (a, b) => b.registration_timestamp - a.registration_timestamp
            );

            if (pageNumber === 1) {
                setUsers(sortedUsers);
            } else {
                setUsers(prev =>
                    [...prev, ...sortedUsers].sort(
                        (a, b) => b.registration_timestamp - a.registration_timestamp
                    )
                );
            }

            setPage(data.page);
            setTotalPages(data.total_pages);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers(1);
    }, []);

    return (
        <section className={styles.blockUsers} id="users">
            <h1>Working with GET request</h1>
            <div className={styles.cardList}>
                {users.map(user => (
                    <div className={styles.cardItem} key={user.id}>
                        <img src={user.photo} alt={user.name} className={styles.cardPhoto} />
                        <p className={styles.cardName} title={user.name}>{user.name}</p>
                        <div className={styles.cardContact}>
                            <p className={styles.cardPosition} title={user.position}>{user.position}</p>
                            <p className={styles.cardEmail} title={user.email}>{user.email}</p>
                            <p className={styles.cardPhone} title={user.phone}>{user.phone}</p>
                        </div>
                    </div>
                ))}
            </div>

            {page < totalPages && (
                <button className={styles.buttonShowMore} onClick={() => loadUsers(page + 1)} disabled={loading}>
                    {loading ? 'Loading...' : 'Show more'}
                </button>
            )}
        </section>
    );
}
