<script>
    import axios from 'axios'
    export default {
        name: 'App',
        data() {
            return {
                baseApiURL: import.meta.env.VITE_APP_BASE_API_URL,
                notes: [],
                note: {                    
                    isEdit: false,
                    title: '',
                    description: '',
                    key: ''
                }
            }
        },
        async mounted() {
            const response = await axios.get(this.baseApiURL + 'api/notes')
            console.log(response.data)
            this.notes = response.data
        },
        methods: {
            async addNote(e) {
                e.preventDefault()
                this.note.key = (parseInt(this.notes[this.notes.length - 1].key) + 1).toString()
                const response = await axios.post(this.baseApiURL + 'api/create', this.note)
                console.log(response.data)
                this.notes.push(response.data)
                this.note.title = ''
                this.note.description = ''
                this.note.key = ''
            },
            async editNote(i) {
                this.notes[i].isEdit = true
            },
            async updateNote(item, i) {
                const response = await axios.put(this.baseApiURL + item._id, {
                    title: this.notes[i].title,
                    description: this.notes[i].description,
                    key: this.notes[i].key
                })
                console.log(response.data)
                this.notes[i].isEdit = false
            },
            async removeNote(item, i) {
                // console.log(key)
                const response = await axios.delete(this.baseApiURL + item._id)
                this.notes.splice(i, 1)
                console.log(response.data)
            }
        }
    }
</script>

<template>
    <div class="row add">
        <form class="col s12 center">
            <div class="row">
                <div class="input-field col s6">
                    <input v-model="note.title" id="first_name" type="text" class="validate">
                    <label class="active" for="first_name">Title</label>
                </div>
                <div class="input-field col s6">
                    <input v-model="note.description" id="last_name" type="text" class="validate">
                    <label class="active" for="last_name">Description</label>
                </div>
            </div>
            <button class="waves-effect waves-light btn-large" @click="addNote"><i class="material-icons right">add_circle</i>Add Note</button>
        </form>
    </div>
    <ul>
            <li v-for="(note, i) in notes" :key=note._id>
                
                <template v-if="!note.isEdit">
                    <div class="row">
                        <div class="col s12">
                            <div class="card blue-grey darken-1">
                                <div class="card-content white-text">
                                    <span class="card-title"><h1>{{ note.title }}</h1></span>
                                    <p>{{ note.description }}</p>
                                    <p>{{ note.key }}</p>
                                </div>
                                <div class="card-action">
                                    <button class="waves-effect waves-light btn" @click="removeNote(note, i)"><i class="material-icons right">close</i>Remove item</button>
                                    <button class="waves-effect waves-light btn" @click="editNote(i)"><i class="material-icons right">edit</i>Edit item</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="row">
                        <form class="col s12">
                            <div class="row">
                                <div class="input-field col s6">
                                    <input v-model="note.title" id="first_name" type="text">
                                    <label class="active" for="first_name">Title</label>
                                </div>
                                <div class="input-field col s6">
                                    <input v-model="note.description" id="last_name" type="text">
                                    <label class="active" for="last_name">Description</label>
                                </div>
                                <div class="input-field col s6">
                                    <input v-model="note.key" id="last_name" type="text">
                                    <label class="active" for="last_name">Key</label>
                                </div>
                            </div>
                            <button class="waves-effect waves-light btn-large" @click="updateNote(note, i)"><i class="material-icons right">check_circle</i>Update item</button>
                        </form>
                    </div>
                </template>

            </li>
    </ul>
</template>

<style>

    ul {
        width: 80%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

        ul > li {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

            ul > li > .row {
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
    
    .card-action {
        display: flex;
        flex-direction: row;
        gap: 1%;
    }

    .add {
        width: 80%;
        margin: 2% auto;
    }

</style>