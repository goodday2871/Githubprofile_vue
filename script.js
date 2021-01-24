var app = new Vue({
    el:'#app',
    data:{
        APIURL :'https://api.github.com/users/',
        user:'',
        userData:{},
        repoData:[],
        idx:3
    },
    methods:{
        async showInfo(){
        try{    
            const { data:user } = await axios.get(`${this.APIURL}${this.user}`)
            this.userData = user
            const { data:repos } = await axios.get(`${this.APIURL}${this.user}/repos?sort=created`)
            repos.forEach((repo)=>{
                this.repoData.push(repo)
            })      
            this.createInfoCard()
            this.createRepoCard()
            this.user = ''
        }catch(err){
            if(err.response.status == 404){
                this.createErrorCard('No profile with this username')
            }
        }
        
        },
        createInfoCard(){
            const cardHTML = ` 
                <div class="card">
                    <div>
                    <img
                        src="${this.userData.avatar_url}"
                        alt="${this.userData.name}"
                        class="avatar"
                    />
                    </div>
                    <div class="user-info">
                    <h2>${this.userData.name}</h2>
                    <p>
                        ${this.userData.bio}
                    </p>
                    <ul>
                        <li>${this.userData.followers}<strong>Followers</strong></li>
                        <li>${this.userData.following}<strong>Following</strong></li>
                        <li>${this.userData.public_repos}<strong>Repo</strong></li>
                    </ul>
                    </div>
                </div>
                <div id="repos" ref="repos">
                    </div>
                `
            this.$refs.main.innerHTML = cardHTML    
            
        },
        createErrorCard(msg){
            const cardHTML = `
                <div class = "card">
                    <h1>${msg}</h1>
                </div>
            `
            main.innerHTML = cardHTML
        },
        createRepoCard(){
           this.repoData = this.repoData.map(repo=>{
                const repoEl = document.createElement('div')
                repoEl.innerHTML=`
                    <h3>Title : ${repo.name}</h3>
                    URL :   <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                    <p>Description : ${repo.description}</p>
                    <P>Language : ${repo.language}</P>
                `
                repoEl.classList.add('repo')
                return repoEl
            })
            console.log(this.repoData)
            //init repos
            const repos = document.getElementById('repos')
            for(let i = 0 ; i < 3 ; i++){
                repos.appendChild(this.repoData[i])
            } 
        },
        infinityScroll(){
            
            const repos = document.getElementById('repos')
            for(let i=0 ; i<3 ; i++ ){
                if(this.idx < this.repoData.length -1){
                    this.idx +=1 
                    repos.appendChild(this.repoData[this.idx])
                }
            }
            
        }
    },
    mounted:function(){
        window.addEventListener('scroll',()=>{
            const {scrollTop, scrollHeight, clientHeight}= document.documentElement
        
            if(clientHeight + scrollTop >= scrollHeight - 5){
                this.infinityScroll()
                }
            }
        )
    }
})


