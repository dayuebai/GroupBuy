#include <my_global.h>
#include <my_sys.h>
#include <mysql.h>
#include <string.h>

#ifdef HAVE_DLOPEN

#include <math.h>
#define min(a,b) fmin(a,b)

my_bool edth_init(UDF_INIT*, UDF_ARGS*, char*);

void edth_deinit(UDF_INIT*);

longlong edth(UDF_INIT*, UDF_ARGS*, char*, char*);



/*
 * - assumes both strings are in the same case
 */
longlong edth(UDF_INIT *initid __attribute__((unused)),
              UDF_ARGS *args, char *is_null, 
              char *error __attribute__((unused)))
{
  const char *a = args->args[0], *b = args->args[1];
  int thrhld = *((longlong*) args->args[2]);

  if (!a || !b)	{ /* Null argument */
    *is_null=1;
    return 0;
  }
  
  const int a_len = args->lengths[0], b_len = args->lengths[1];

  if (a_len == 0) return b_len <= thrhld;
  if (b_len == 0) return a_len <= thrhld;
  
  int i, j, i_prv, i_crt, d[2][b_len + 1], min_crt;

  for (j = 0; j <= b_len; j++) d[0][j] = j;
  i_prv = 0;
  i_crt = 1;
  for (i = 1; i <= a_len; i++) {
    min_crt = d[i_crt][0] = i;
    for (j = 1; j <= b_len; j++) {
      d[i_crt][j] = min(min(
                            d[i_prv][j  ] + 1,
                            d[i_crt][j-1] + 1),
                        d[i_prv][j-1] + (a[i-1] == b[j-1] ? 0 : 1));
      min_crt = min(min_crt, d[i_crt][j]);
    }
    if (min_crt > thrhld) return 0;
    i_prv = i_prv ? 0 : 1;
    i_crt = i_crt ? 0 : 1;
  }

  return d[i_prv][b_len] <= thrhld;
}

my_bool edth_init(UDF_INIT *initid, UDF_ARGS *args, char *message)
{
  if (args->arg_count != 3 ||
      args->arg_type[0] != STRING_RESULT || 
      args->arg_type[1] != STRING_RESULT)
    {
      strcpy(message, "Wrong arguments to editdist;  Use the source");
      return 1;
    }
  return 0;
}

void edth_deinit(UDF_INIT *initid __attribute__((unused)))
{
}

#endif /* HAVE_DLOPEN */
