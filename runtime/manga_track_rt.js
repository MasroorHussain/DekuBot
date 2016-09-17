var config = require("../config.json"),
	Datastore = require('nedb');

var db = new Datastore({
  filename: './runtime/databases/manga_track_store',
  autoload: true
});

db.persistence.setAutocompactionInterval(30000);

exports.trackManga = function(urls, chap, channel, guild, mention) {
  var mangadoc = {
    url: urls,
    chapter: chap,
		guild_id: guild,
		channel_id: channel,
		mention: mention,
		pm_array: []
  };
  db.insert(mangadoc, function(err, result) {
    if (err) {
      console.log('Error making manga document! ' + err);
    } else if (result) {
	  console.log('Sucess making a manga doc');
    }
  });
};

exports.getAll = function() {
	return new Promise(function(resolve, reject) {
		try {
			db.find({
			_id: /[0-9]/
		  }, function(err, result) {
			  if(!err || result.length > 0) {
				returnArray = [];
				for (i = 0; i < result.length; i++ ) {
					returnArray.push(result[i])
				}
				resolve(returnArray);
			  }

		   });
		} catch (e) {
			reject(e);
		}
	});
};

exports.updateChapter = function(id, chap) {
  return new Promise(function(resolve, reject) {
    try {
      db.find({
		_id: id
	  }, function(err, result) {
		  if(!err && result.length > 0) {
			if (result[0].chapter != chap) {
				db.update({
				  _id: id
				}, {
				  $set: {
					chapter: chap
				  }
				}, {});
			}
		  }

	   });
    } catch (e) {
      reject(e);
    }
  });
};

exports.updateChannel = function(id, channel) {
  return new Promise(function(resolve, reject) {
    try {
      db.find({
		_id: id
	  }, function(err, result) {
		  if(!err && result.length > 0) {
			if (result[0].channel_id != channel) {
				db.update({
				  _id: id
				}, {
				  $set: {
					channel_id: channel
				  }
				}, {});
			}
		  }

	   });
    } catch (e) {
      reject(e);
    }
  });
};

exports.updateMention = function(id, mention) {
  return new Promise(function(resolve, reject) {
    try {
      db.find({
		_id: id
	  }, function(err, result) {
		  if(!err && result.length > 0) {
			if (result[0].mention != mention) {
				db.update({
				  _id: id
				}, {
				  $set: {
					mention: mention
				  }
				}, {});
			}
		  }

	   });
    } catch (e) {
      reject(e);
    }
  });
};

exports.addToPM = function(id, user) {
  return new Promise(function(resolve, reject) {
    try {
      db.find({
        _id: id
      }, function(err, res) {
        if (err) {
          return reject(err);
        }
        if (res.length === 0) {
          return reject('Nothing found!9');
        } else {
			db.update({
				_id: id
			}, {
				$push: {
					pm_array: user.id
				}
			}, {});
          resolve('User now tracking');
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};

exports.removeFromPM = function(id, user) {
  return new Promise(function(resolve, reject) {
    try {
      db.find({
        _id: id
      }, function(err, res) {
        if (err) {
          return reject(err);
        }
        if (res.length === 0) {
          return reject('Nothing found!10');
        } else {
			db.update({
				_id: id
			}, {
				$pull: {
					pm_array: user.id
				}
			}, {});
          resolve('User now not tracking');
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};

exports.get = function(id) {
	return new Promise(function(resolve, reject) {
		try {
			db.find({
			_id: id
		  }, function(err, result) {
			  if(!err && result.length > 0) {
					resolve(result[0]);
			  }
		   });
		} catch (e) {
			reject(e);
		}
	});
};

exports.deleteTrack = function(id) {
	return new Promise(function(resolve, reject) {
    try {
			db.find({
			_id: id
		  }, function(err, res) {
        if (err) {
          return reject(err);
        }
        if (res.length === 0) {
          return reject('Not tracking a manga with this name');
        } else {
          db.remove({
            _id: res[0]._id
          }, {}, function(err, nr) {
            if (err) {
              return reject(err);
            }
            if (nr >= 1) {
              resolve('No longer tracking.');
            }
          });
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};
