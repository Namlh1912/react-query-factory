import {
  GetNextPageParamFunction,
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useInfiniteQuery,
} from "@tanstack/react-query";

type ServiceFunction<TParams = undefined, TResult = unknown> = [
  TParams
] extends [undefined]
  ? (params?: TParams) => Promise<TResult>
  : (params: TParams) => Promise<TResult>;

// // Define UseMutationFn types for with and without parameters
// type UseInfiniteQueryFnWithoutParams<TResult> = (
//   options?: Omit<
//     UseInfiniteQueryOptions<
//       TResult,
//       unknown,
//       InfiniteData<TResult, unknown>,
//       TResult,
//       QueryKey,
//       unknown
//     >,
//     "queryKey" | "queryFn"
//   >
// ) => UseInfiniteQueryResult<TResult, unknown>;

type UseInfiniteQueryFnWithParams<TParams, TResult> = (
  params: TParams,
  options?: Omit<
    UseInfiniteQueryOptions<
      TResult,
      unknown,
      InfiniteData<TResult, unknown>,
      TResult,
      QueryKey,
      unknown
    >,
    "queryKey" | "queryFn"
  >
) => UseInfiniteQueryResult<TResult, unknown>;

// function createUseInfiniteQuery<TResult>(params: {
//   serviceFn: ServiceFunction<undefined, TResult>;
//   queryKey?: (params?: undefined) => QueryKey;
//   initialPageParam: number;
//   getNextPageParam: GetNextPageParamFunction<unknown, TResult>;
// }): UseInfiniteQueryFnWithoutParams<TResult>;
function createUseInfiniteQuery<TParams, TResult>(params: {
  serviceFn: ServiceFunction<undefined, TResult>;
  queryKey?: (params: TParams) => QueryKey;
  initialPageParam: number;
  getNextPageParam: GetNextPageParamFunction<unknown, TResult>;
}): UseInfiniteQueryFnWithParams<TParams, TResult>;
function createUseInfiniteQuery<
  TParams = undefined,
  TResult = unknown
>(params: {
  serviceFn: ServiceFunction<TParams, TResult>;
  queryKey?: (params: TParams) => QueryKey;
  initialPageParam: number;
  getNextPageParam: GetNextPageParamFunction<unknown, TResult>;
}) {
  const { serviceFn, getNextPageParam, initialPageParam, queryKey } = params;
  return function (
    params: TParams,
    options?: UseInfiniteQueryOptions<
      TResult,
      unknown,
      InfiniteData<TResult, unknown>,
      TResult,
      QueryKey,
      unknown
    >
  ) {
    const computedKey = queryKey?.(params) || options?.queryKey || [];
    return useInfiniteQuery({
      queryFn: () => serviceFn(params),
      queryKey: computedKey,
      getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
        getNextPageParam(lastPage, allPages, lastPageParam, allPageParams),
      initialPageParam,
      ...options,
    });
  };
}

export { UseInfiniteQueryFnWithParams, createUseInfiniteQuery };
