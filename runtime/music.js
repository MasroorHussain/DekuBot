var Discord = require("discord.js");
var youtubeNode = require("youtube-node");
var ytdl = require("ytdl-core");

var guildArray = []

exports.addToGuildArray = function(bot, guild) {
	var obj = {
		guildID: guild.id,
		skipArray: [],
		stream: '',
		songs: []
	}
	guildArray.push(obj)
};

exports.removeFromGuildArray = function(bot, guild) {
	for (i = 0; i < guildArray.length; i++) {
    if (guildArray[i].guildID == guild.id) {
      guildArray.splice(i, 1)
    }
  } 
};

exports.addToSongs = function(bot, guild, url, user) {
	for (x = 0; x < guildArray.length; x++) {
		(function(i) {

	    if (guildArray[i].guildID == guild.id) {

	    	if (guildArray[i].songs.length === 0) {
	    		guildArray[i].songs.push({
	    			url: url,
	    			addedBy: user.displayName
	    		})
					const streamOptions = { seek: 0, volume: 0.3 };
				  const stream = ytdl(guildArray[i].songs[0].url, {filter : 'audioonly'});
				  const dispatcher = guild.voiceConnection.playStream(stream, streamOptions)
				  guildArray[i].stream = dispatcher
				  
				  addListener(guildArray[i], guild)
					
	    	} else {
	    		guildArray[i].songs.push({
	    			url: url,
	    			addedBy: user.displayName
	    		})
	    	}
	    }

		})(x)

  } 
};

var addListener = function(currentGuild, guild) {
	
	currentGuild.stream.on('end', () => {
		if (currentGuild.songs.length > 1) {

			const streamOptions = { seek: 0, volume: 0.3 };
	    const stream = ytdl(currentGuild.songs[1].url, {filter : 'audioonly'});
	    const dispatcher = guild.voiceConnection.playStream(stream, streamOptions)
			currentGuild.stream = dispatcher
			addListener(currentGuild, guild);

			currentGuild.songs.splice(0, 1)
		} else if (currentGuild.songs.length === 1) {
			currentGuild.songs.splice(0, 1)	
		}
	});
};

exports.clearSongs = function(bot, guild) {
	for (i = 0; i < guildArray.length; i++) {
    if (guildArray[i].guildID == guild.id) {
      guildArray[i].songs = []
      exports.endSong(bot, guild)
    }
  } 
};

exports.skipSong = function(bot, voiceChannel, id, channel) {
	for (x = 0; x < guildArray.length; x++) {
		(function(i) {		
	    if (guildArray[i].guildID == voiceChannel.guild.id) {
	   		if (skipCheck(id, guildArray[i])) {
	   			guildArray[i].skipArray.push(id)
	   			channel.sendMessage("```Votes to skip current song: " + guildArray[i].skipArray.length + " / " + Math.ceil((voiceChannel.members.array().length-1)/2) + "```")
		      if ((guildArray[i].skipArray.length) / (voiceChannel.members.array().length-1) >= 0.5) {
		      	exports.endSong(bot, voiceChannel.guild)
		      	guildArray[i].skipArray = []
		      	channel.sendMessage("```fix\nSkipping song...```")
		      }
	   		}
	    }
    })(x)
  }
};

exports.endSong = function(bot, guild) {
	for (x = 0; x < guildArray.length; x++) {
		(function(i) {
			if (guildArray[i].guildID == guild.id) {

	    	guildArray[i].stream.end()

	    }
		})(x)
  } 
};

var skipCheck = function(id, guild) {
	for (i = 0; i < guild.skipArray.length; i++) {
		if (guild.skipArray[i] == id) {
			return false
		}
	}
	return true
}

exports.getQueue = function(bot, guild, channel) {
	for (x = 0; x < guildArray.length; x++) {
		(function(i) {
			if (guildArray[i].guildID == guild.id) {
				if (guildArray[i].songs.length === 0) {
					channel.sendMessage('```fix\nThere are currently no songs in the queue```')
				} else {
					var msgArray = []
					msgArray.push("```diff\nThe current song queue is:\n---------------------------------------------------------------------------------")
					for (k = 0; k < guildArray[i].songs.length; k++) {
						msgArray.push("+ URL: " + guildArray[i].songs[k].url + "       Added By: " + guildArray[i].songs[k].addedBy + "\n")
					}
					msgArray.push('```')
					channel.sendMessage(msgArray)
				}
				
			}
		})(x)
	}
}

exports.pause = function(bot, guild) {
	for (x = 0; x < guildArray.length; x++) {
		(function(i) {
			if (guildArray[i].guildID == guild.id) {

	    	guildArray[i].stream.pause()

	    }
		})(x)
  } 
};

exports.resume = function(bot, guild) {
	for (x = 0; x < guildArray.length; x++) {
		(function(i) {
			if (guildArray[i].guildID == guild.id) {

	    	guildArray[i].stream.resume()

	    }
		})(x)
  } 
};

exports.setVolume = function(bot, guild, volume) {
	for (x = 0; x < guildArray.length; x++) {
		(function(i) {
			if (guildArray[i].guildID == guild.id) {

	    	guildArray[i].stream.setVolume(volume/100)

	    }
		})(x)
  } 
};