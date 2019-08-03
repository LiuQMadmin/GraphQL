import express from "express"
import { graphql} from 'graphql'
import graphqlHTTP from 'express-graphql'
import {schema,MutationRootType} from "./schema"
const app=express()


app.use('/graphql',graphqlHTTP({
        schema,
        graphiql:true
    })
)

app.use("/getSubject",(req,res)=>{
    const id=req.query.id
    const query=`{
        subject(id:${id}){
            id,
            title
        }
    }`
    graphql(schema,query)
    .then((result) => {
        res.send(result)
    })
})

app.use("/getAll",(req,res)=>{
    const query=`{
        subjects{
            id,
            theater{
                name
            },
            comments{
                content
            }
        }
    }`
    graphql(schema,query)
    .then((result)=>{
        res.send(result)
    })
})
// app.post("/addData",(req,res)=>{
//     console.log(req.query)
//     // const {title,genres,rating,rating}=req.body
//     const mutation=`{
//             create(
//               title:"西游记",
//               genres:"古装戏",
//               rating:9.8,
//               theater:1
//             ){
//               succ
//             }
//     }`
//     graphql(schema,mutation)
//     .then((result)=>{
//         res.send(result)
//     })
// })



app.use("/",(req,res)=>{
    graphql(schema,'{ hello}')
    .then((result)=>{
        res.send(result)
    })
})



app.listen(3000)