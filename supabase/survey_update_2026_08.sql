-- 2026-08 설문 문항 변경용 Supabase 마이그레이션
-- 기존 survey_responses 응답은 삭제하지 않습니다.
-- Supabase > SQL Editor > New query 에서 이 파일 전체를 한 번 실행하세요.

alter table public.survey_responses
  add column if not exists souvenir_helpfulness smallint
    check (souvenir_helpfulness is null or souvenir_helpfulness between 1 and 5);

alter table public.survey_responses
  add column if not exists inconvenience_other text not null default ''
    check (char_length(inconvenience_other) <= 500);

notify pgrst, 'reload schema';
