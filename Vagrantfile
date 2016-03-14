# -*- mode: ruby -*-
# vi: set ft=ruby :

box      = 'boxcutter/ubuntu1404'
hostname = 'ember-test'
#domain   = 'example.com'
#ip       = '192.168.42.42'
ram      = '2048'

$rootScript = <<SCRIPT
  echo "I am provisioning..."
  echo doing it as $USER
  cd /home/vagrant
  apt-get update
  apt-get install -y software-properties-common
  add-apt-repository ppa:git-core/ppa
  sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
  echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" > /etc/apt/sources.list.d/mongodb-org-3.2.list
  apt-get update
  apt-get install -y vim git-core curl build-essential automake autoconf python-dev nginx mongodb-org nfs-common portmap git-extras

  #service start nginx

  #git clone https://github.com/facebook/watchman.git /opt/watchman;
  #  ( cd /opt/watchman;
  #    git checkout v3.9.0;
  #    ./autogen.sh;
  #    ./configure;
  #    make;
  #    make install;
  #  );

SCRIPT

$userScript = <<SCRIPT
  cd /home/vagrant
  wget -qO- https://raw.github.com/creationix/nvm/master/install.sh | sh
  export NVM_DIR="/home/vagrant/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
  nvm install 5.8.0
  nvm alias default 5.8.0
  npm install -g bower ember-cli phantomjs-prebuilt
  cd ~ && cat ~/.bashrc_copy >> ~/.bashrc
  #if [ ! -d ~/vagrant ]; then
    #ln -s /vagrant ~/vagrant
  #fi
  cd /vagrant/library-app
  npm install
  bower install
SCRIPT

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(2) do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://atlas.hashicorp.com/search.
  config.vm.box = box

  # Forwarding default ports for ember server and livereload
  config.vm.network :forwarded_port, guest: 4200, host: 4200, auto_correct: true
  config.vm.network :forwarded_port, guest: 35729, host: 35729, auto_correct: true
  config.vm.network :forwarded_port, guest: 49152, host: 49152, auto_correct: true

  config.ssh.forward_agent = true

  config.vm.synced_folder ".", "/vagrant",
    owner: "vagrant", group: "vagrant"

  # Removes "stdin: is not a tty" annoyance as per
  # https://github.com/SocialGeeks/vagrant-openstack/commit/d3ea0695e64ea2e905a67c1b7e12d794a1a29b97
  config.ssh.shell = "bash -c 'BASH_ENV=/etc/profile exec bash'"


  config.vm.provision "file", source: ".gitconfig", destination: "~/.gitconfig"
  config.vm.provision "file", source: ".bashrc_copy", destination: "~/.bashrc_copy"

  # Shell provisioning.
  config.vm.provision "shell", inline: $rootScript
  config.vm.provision "shell", inline: $userScript, privileged: false

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  # config.vm.network "forwarded_port", guest: 80, host: 8080

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network "private_network", ip: "192.168.33.10"
  config.vm.network :private_network, ip: "192.168.33.3"
  config.vm.hostname = hostname

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # config.vm.synced_folder "../data", "/vagrant_data"
  config.vm.synced_folder ".", "/vagrant", type: "nfs", group: nil, owner: nil, mount_options: ['rw', 'vers=3', 'tcp', 'fsc' ,'actimeo=2']
  config.nfs.map_uid = Process.uid
  config.nfs.map_gid = Process.gid

  config.vm.provider "virtualbox" do |vb|
    vb.customize  [ "modifyvm", :id, "--memory", ram ]

    # Allow the creation of symlinks for nvm
    # http://blog.liip.ch/archive/2012/07/25/vagrant-and-node-js-quick-tip.html
    vb.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/vagrant","1"]
  end

  config.vm.provider "parallels" do |prl|
    prl.linked_clone = true
    prl.check_guest_tools = true
    prl.update_guest_tools = true
    prl.memory = ram
    prl.cpus = 4
    prl.name = hostname
  end
end
