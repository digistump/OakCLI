Vagrant.configure("2") do |config|

  config.vm.provider :virtualbox do |vb|
    vb.memory = 2048
    vb.cpus = 2
  end

  config.vm.define "ubuntu-x64" do |x64|
    x64.vm.box = "ubuntu/precise64"
    x64.vm.provision "shell", path: "build_scripts/linux_provision64.sh"
  end

  config.vm.define "ubuntu-x86" do |x86|
    x86.vm.box = "ubuntu/precise32"
    x86.vm.provision "shell", path: "build_scripts/linux_provision32.sh"
  end
end

