-- Aprova os 2.524 comentários históricos do WordPress (importados como 'pending').
-- Eles foram aprovados no WP, então liberamos todos de uma vez.
update public.blog_templum_comments set status = 'approved' where status = 'pending';
