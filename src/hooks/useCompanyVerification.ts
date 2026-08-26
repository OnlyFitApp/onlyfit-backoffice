import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listCompanyVerifications,
  reviewCompanyVerification,
  type CompanyVerificationStatus,
} from '../lib/companyVerification';

export function useCompanyVerifications(
  status: CompanyVerificationStatus,
  limit: number,
  offset: number,
) {
  return useQuery({
    queryKey: ['company-verifications', status, limit, offset],
    queryFn: () => listCompanyVerifications(status, limit, offset),
    staleTime: 20_000,
  });
}

export function useReviewCompanyVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewCompanyVerification,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['company-verifications'] }),
  });
}
