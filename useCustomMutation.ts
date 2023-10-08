import {
  MutationFunction,
  MutationKey,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  useMutation as useBaseMutation,
  useQueryClient,
} from "@tanstack/react-query";

type CustomMutationOptions<TData, TError, TVariables, TContext> = UseMutationOptions<
  TData,
  TError,
  TVariables,
  TContext
> & {
  refetchQueries?: MutationKey[];
  updateQuery?: QueryKey;
};

export function useCustomMutation<
  TData = unknown,
  TError = unknown,
  TVariables = undefined,
  TContext = undefined
>(
  mutationFn: MutationFunction<TData, TVariables>,
  options?: CustomMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
  const queryClient = useQueryClient();

  const mutationOptions = {
    ...options,
    onSuccess: async (
      ...args: [data: TData, variables: TVariables, context: TContext | undefined]
    ) => {
      if (options?.onSuccess) {
        await options.onSuccess(...args);
      }

      const { data } = args?.[0] as any;

      if (options?.refetchQueries && data) {
        options.refetchQueries.forEach((queryKey) => {
          queryClient.invalidateQueries(queryKey);
        });
      }
      if (options?.updateQuery && args?.[0] && data) {
        queryClient.setQueryData(options?.updateQuery, args?.[0]);
      }
    },
  };

  return useBaseMutation<TData, TError, TVariables, TContext>(mutationFn, mutationOptions);
}
