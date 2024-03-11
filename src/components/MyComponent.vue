<script>
    import axios from 'axios'
    export default {
        name: 'App',
        data() {
            return {
                notes: [],
                note: {
                    title: '',
                    description: '',
                    key: ''
                }
            }
        },
        async mounted() {
            const response = await axios.get('http://localhost:3000/api/notes')
            console.log(response.data)
            this.notes = response.data
        },
        methods: {
            async addNote(e) {
                e.preventDefault()
                this.note.key = (parseInt(this.notes[this.notes.length - 1].key) + 1).toString()
                const response = await axios.post('http://localhost:3000/api/create', this.note)
                console.log(response.data)
                this.notes.push(response.data)
                this.note.title = ''
                this.note.description = ''
                this.note.key = ''
            },
            async removeNote(item, i) {
                // console.log(key)
                const response = await axios.delete(`http://localhost:3000/` + item._id)
                this.notes.splice(i, 1)
                console.log(response.data)
            }
        }
    }
</script>

<template>
    <ul>
        <li v-for="(note, i) in notes" :key=note._id>
            <h1>{{ note.title }}</h1>
            <p>{{ note.description }}</p>
            <p>{{ note.key }}</p>
            <button @click="removeNote(note, i)">Remove Note</button>
        </li>
    </ul>
    <div>
        <form>
            <input type="text" v-model="note.title">
            <input type="text" v-model="note.description">
            <button @click="addNote">Add Note</button>
        </form>
    </div>
</template>

<style>
</style>