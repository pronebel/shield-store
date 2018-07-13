


# 缓存的过期策略

1. 设置读取次数  2.设置过期时间

```$js
  import {store,cache} from 'shield-store'
  
  cache.set('key1','val1',{
    time:60,  //以秒为单位,不设置则不采取过期时间策略
    read:10   //以次为单位,不设置则不采取次数策略
  })

```
