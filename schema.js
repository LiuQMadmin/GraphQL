
import axios from 'axios';
import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull
  } from 'graphql'
  const API_BASE="http://localhost:9000"

  const CommentsType = new GraphQLObjectType({
    name: 'CommentsType',
    fields: {
      id: {
        type: GraphQLInt,
      },
      content: {
        type: GraphQLString
      }
    }
  })

  const TheaterType=new GraphQLObjectType({
      name:"TheaterType",
      fields:{
          id:{
              type:GraphQLInt
          },
          name:{
              type:GraphQLString
          }
      }
  })

  const SubjectType = new GraphQLObjectType({
      name:"SubjectType",
      fields:{
          id:{
              type:GraphQLInt
          },
          title:{
              type:GraphQLString
          },
          genres:{
              type:GraphQLString
          },
          rating:{
              type:GraphQLFloat
          },
        //   可以把别的字段里面的数据引用过来
          theater:{
             type:TheaterType,
             resolve(obj){
                // obj里面的内容就是查询上一个里面数据传递过来的
                console.log(obj)
                 return axios({
                     url:`${API_BASE}/theaters/${obj.id}`
                 }).then((result)=>{
                     return result.data
                 })
             }
          },
          comments:{
              type:new GraphQLList(CommentsType),
              resolve(obj){
              return axios({
                  url:`${ API_BASE }/comments/?subject=${obj.id}`
              })
              .then((result) => {
                return result.data
              })
            }
          }

      }
  })

  const SuccessType=new GraphQLObjectType({
      name:"SuccessType",
      fields:{
          succ:{
              type:GraphQLString,
              resolve(){
                  return "数据插入成功"
              }
          }
      }
  })

  const MutationRootType = new GraphQLObjectType({
      name:"MutationRootType",
      fields:{
          create:{
              type:SuccessType,
              args:{
                  title:{
                      type:GraphQLNonNull(GraphQLString)
                  },
                  genres:{
                      type:GraphQLNonNull(GraphQLString)
                  },
                  rating:{
                      type:GraphQLNonNull(GraphQLFloat)
                  },
                  theater:{
                      type:GraphQLNonNull(GraphQLInt)
                  }
              },
              resolve(obj,args){
                  console.log(args)
                //   let {title,genres,rating,theater}=args
                //   return axios.post(`${API_BASE}/subjects`,{title,genres,rating,theater})
                //   .then(result=>result.data)
              }
          }
      }
  })


const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: {
            hello: {
            type: GraphQLString,
            resolve() {
                return 'world';
            }
            },
            // 可以使用express-graphql测试工具进行测试
            subjects: {
                type : new GraphQLList(SubjectType),
                resolve(){
                    return axios({
                        url:`${API_BASE}/subjects`,
                    }).then((result)=>{
                        return result.data
                    })
                },
            },
            // 这个可以按照前端输入的id进行查找
            subject: {
                type:SubjectType,
                args: {
                    id: {
                      type: GraphQLInt
                    }
                },
                resolve(obj, args, context) {
                    return axios({
                        url:`${API_BASE}/subjects/${args.id}`
                    }).then((result) => {
                        return result.data
                    })
                }
            }

        }
    }),
    mutation: MutationRootType
  });



  export {schema,MutationRootType}