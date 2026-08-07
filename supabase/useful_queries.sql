-- 전체 응답 수
select count(*) as total_responses
from public.survey_responses;

-- 문항별 평균 점수
select
  round(avg(overall_satisfaction)::numeric, 2) as avg_overall_satisfaction,
  round(avg(participation_clarity)::numeric, 2) as avg_participation_clarity,
  round(avg(stamp_process_convenience)::numeric, 2) as avg_stamp_process_convenience,
  round(avg(lighthouse_interest)::numeric, 2) as avg_lighthouse_interest,
  round(avg(future_participation)::numeric, 2) as avg_future_participation
from public.survey_responses;

-- 언어별 참여 수
select language, count(*) as responses
from public.survey_responses
group by language
order by responses desc;

-- 불편 사항별 선택 횟수
select issue, count(*) as selected_count
from public.survey_responses,
unnest(inconveniences) as issue
group by issue
order by selected_count desc;

-- 최근 응답 확인
select *
from public.survey_responses
order by created_at desc
limit 100;
